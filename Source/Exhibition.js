/*
---
description:

license: MIT-style

authors:
- Noritaka Horio

requires:
- core:1.2.4/ '*'

provides: [Exhibition,Exhibition.Horizontal,Exhibition.Vertical]
...
*/

var Exhibition = new Class({
	
	Implements: [Events, Options],

	options: {
		"defaultIndex": 0,
		"duration": 300,
		"transition": "expo:out",
		"blank": 50
/*
		onChange: $empty
		onNext: $empty
		onPrev: $empty
		onActive: $empty
*/
	},

	initialize: function (container,sources,options) {
		this.setOptions(options);
		this.container = container;
		this.elements = sources;
		this.tween = {
			"duration": this.options.duration,
			"transition": this.options.transition,
			"onComplete": this.onComplete.bind(this)
		};
		this.index = this.options.defaultIndex;
		this.properties = [];
		this.counter = 0;
		this.addEvent("onImagePreload", this.onImagePreload.bind(this));
		this.preload();
		this.reset();
		this.adjustment();
		this.setEvents();
	},

	reset: function() {
		var positions = this.calculation();
		positions.each(function(p,k){
			var e = this.elements[k];
			e.setStyle("left", p.x);
			e.setStyle("top", p.y);
		}, this);
		this.elements.removeClass("active");
		this.elements[this.index].addClass("active");
	},

	calculation: function() {
		var size = this.container.getSize();
		var x = size.x/2, y = size.y/2, left = size.x/2, top = size.y/2, height = 0;

		this.positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			this.positions.push({x: left, y: top});
			var index = k + 1;
			if (index > 1 && (index % 5) == 0) {
				left = x;
				top = top + height + this.options.blank;
			} else {
				left = left + size.x + this.options.blank;
			}
			height = Math.max(height, size.y);
		}, this);

		var targets = [];
		this.elements.each(function(e,k) {
			var index = k + 1;
			if (index > 1 && (index % 5) == 0) {
				this.calculationHeight(targets);
				targets = [];
			}
			targets.push(e);
		}, this);







		var e = this.elements[this.index];
		var position = this.positions[this.index];
		var ml = position.x - x + (e.getSize().x/2);
		var mt = position.y - y + (e.getSize().y/2);
		this.elements.each(function(e,k) {
			this.positions[k].x = this.positions[k].x - ml;
			this.positions[k].y = this.positions[k].y - mt;
		}, this);

		return this.positions;
	},


	calculationHeight: function(targets) {
		var height = 0;
		targets.each(function(e,k) { height = Math.max(e.getSize().y, height); })
		targets.each(function(e,k) {
			var index = this.elements.indexOf(e);
			var position = this.positions[index];
			var size = e.getSize();
			var margin = (height - size.y) / 2;
			this.positions[index].y = position.y + margin;
		}, this);
	},


	calculationWidth: function(targets) {
		var width = 0;
		targets.each(function(e,k) { width = Math.max(e.getSize().x, width); })
		targets.each(function(e,k) {
			var index = this.elements.indexOf(e);
			var position = this.positions[index];
			var size = e.getSize();
			var margin = (width - size.x) / 2;
			this.positions[index].x = position.x + margin;
		}, this);
		return width;
	},








	adjustmentHeight: function(targets) {
		var height = 0;
		targets.each(function(e,k) {
			height = Math.max(e.getSize().y, height);
		})

		targets.each(function(e,k) {
			var size = e.getSize(), position = e.getPosition();
			var margin = (height - size.y) / 2;
			e.setStyle("top", position.y + margin);
		})
	},


	adjustmentWidth: function(targets) {
		var width = 0;
		targets.each(function(e,k) {
			width = Math.max(e.getSize().x, width);
		})

		targets.each(function(e,k) {
			var size = e.getSize(), position = e.getPosition();
			var margin = (width - size.x) / 2;
			e.setStyle("left", position.x + margin);
		})
	},


	adjustment: function() {
		var targets = [];
		this.elements.each(function(e,k) {
			var index = k + 1;
			if (index > 1 && (index % 5) == 0) {
				this.adjustmentHeight(targets);
				targets = [];
			}
			targets.push(e);
		}, this);

//1,6,11,17
/*
		var targets = [];
		for (var i = 0; i < 5; i++) {
			var c = i;
			while(c < this.elements.length - 1){
				targets.push(this.elements[c]);
				c = c + 5;
			}
			this.adjustmentWidth(targets);

		}
	*/




/*
		var positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			positions.push({x: left, y: top});
			var index = k + 1;
			if (index > 1 && (index % 5) == 0) {
				left = x;
				top = top + maxH + this.options.blank;
			} else {
				left = left + size.x + this.options.blank;
			}
			
			maxH = Math.max(maxH, size.y);
			
		}, this);
*/





	},

	render:  function() {
		var positions = this.calculation();
		positions.each(function(end,k) {
			var e = this.elements[k];
			var start = e.getPosition();
			var fx = e.get("morph", this.tween);
			fx.start({
				"left": [start.x, end.x],
				"top": [start.y, end.y]
			});
		}, this);
	},

	setEvents: function() {
		this.elements.each(function(e,k) {
			var a = $(e).getElement("a");
			var h = function(event) {
				event.stop();
				var index = this.elements.indexOf(a.parentNode);
				this.activate(index);
			}.bind(this);
			a.addEvent("click", h);
		}, this);
	},

	onImagePreload: function() {
		this.elements.each(function(e,k) {
			var img = e.getElement("img");
			var p = img.getProperties("width", "height", "title", "alt", "src");
			this.properties.push(p);
		}.bind(this));
		this.fireEvent("preload", [this.elements,this.properties]);
		this.activate(this.index);
	},

	preload: function(){
		var preloadImages = [];
		this.elements.each(function(e,k) {
			var img = e.getElement("img");
			var src = img.getProperty("src");
			preloadImages.push(src);
		});
		var images = new Asset.images(preloadImages, {"onComplete": this.fireEvent.bind(this, "onImagePreload")});
	},

	next: function(){
		var nextIndex = this.index + 1;
		if (nextIndex < this.elements.length) {
			this.index++;
			this.fireEvent("next", [this.index, this.elements[this.index]]);
			this.activate(nextIndex);
		}
	},

	prev: function() {
		var prevIndex = this.index - 1;
		if (prevIndex >= 0) {
			this.index--;
			this.fireEvent("prev", [this.index, this.elements[this.index]]);
			this.activate(prevIndex);
		}
	},

	onComplete: function() {
		this.counter++;
		if (this.counter >= this.elements.length) {
			this.fireEvent("change", [this.index, this.elements[this.index]]);
			this.counter = 0;
		}
	},

	activate: function(index) {
		this.index = index;
		var active = this.elements[this.index];
		var elements = this.elements;
		elements.removeClass("active");
		active.addClass("active");
		this.render();
		this.fireEvent("active", [index,active.getElement("a")]);
	}

});