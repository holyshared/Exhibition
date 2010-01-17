/*
---
description:

license: MIT-style

authors:
- Noritaka Horio

requires:
- core:1.2.4/ '*'

provides: [Exhibition,Exhibition.Horizontal,Exhibition.Vertical,Exhibition.Matrix]
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
*/
	},

	initialize: function (container,sources,options) {
		this.setOptions(options);
		this.container= container;
		this.elements = sources;
		this.tween = {
			"duration": this.options.duration,
			"transition": this.options.transition,
			"onComplete": this.onComplete.bind(this)
		};
		this.index = this.options.defaultIndex;
		this.reset();
		this.adjustment();
		this.setEvents();
		this.counter = 0;
	},

	reset: function() {
		var positions = this.calculation();
		positions.each(function(p,k){
			var e = this.elements[k];
			e.setStyle("left", p.x);
		}, this);
		this.elements.removeClass("active");
		this.elements[this.index].addClass("active");
	},

	calculationHeight: function() {
		this.maxHeight = 0;
		this.baseTop = 0;
		this.elements.each(function(e,k) {
			var y = e.getPosition().y;
			var height = e.getSize().y;
			if (this.maxHeight < height) {
				this.maxHeight = height;
				this.baseTop = height / 2;
			}
		}, this);
	},

	calculation: function() {
		var size = this.container.getSize();
		var x = size.x/2, y = size.y/2, l = size.x/2;
		var positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			positions.push({x: l, y: y});
			l = l + size.x + this.options.blank;
		}, this);

		var e = this.elements[this.index];
		var m = positions[this.index].x - x + (e.getSize().x/2);
		this.elements.each(function(e,k) {
			positions[k].x = positions[k].x - m;
		});
		return positions;
	},

	adjustment: function(){
		this.calculationHeight();
		this.elements.each(function(e,k) {
			var height = e.getSize().y;
			var margin = this.baseTop - (height / 2);
			e.setStyle("top", margin);
		}, this);
		this.container.setStyle("height", this.maxHeight);
	},

	setEvents: function() {
		this.elements.each(function(e,k) {
			var a = $(e).getElement("a");
			var h = function(index) {
				this.activate(index);
			}.bind(this, [k]);
			a.addEvent("click", h);
		}, this);
	},

	next: function(){
		var nextIndex = this.index + 1;
		if (nextIndex < this.elements.length) {
			this.fireEvent("next", [this.index, this.elements[this.index]]);
			this.activate(nextIndex);
		}
	},

	prev: function() {
		var prevIndex = this.index - 1;
		if (prevIndex >= 0) {
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
		this.elements.removeClass("active");
		this.elements[this.index].addClass("active");
		var positions = this.calculation();
		positions.each(function(p,k) {
			var e = this.elements[k];
			var x = e.getPosition().x;
			var fx = e.get("tween", this.tween);
			fx.start("left", [x, p.x]);
		}, this);
	}

});