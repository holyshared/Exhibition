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

	reset: function() { return true; },

	calculation: function() {
		var size = this.container.getSize();
		var x = size.x/2, y = size.y/2, l = size.x/2, t = size.y/2;
		var positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			positions.push({x: l, y: y});
			if (k > 0 && (k % 5) == 0) {
				l = x;

			} else {
				l = l + size.x + this.options.blank;
			}
		}, this);

		var e = this.elements[this.index];
		var m = positions[this.index].x - x + (e.getSize().x/2);
		this.elements.each(function(e,k) {
			positions[k].x = positions[k].x - m;
		});
		return positions;
	},

	adjustment: function() { return true; },

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