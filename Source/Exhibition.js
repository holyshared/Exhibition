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
		this.reset();
		this.adjustment();
		this.setEvents();
		this.counter = 0;
	},

	reset: function() { return true; },
	calculation: function() { return true; },
	adjustment: function() { return true; },
	render:  function() { return true; },

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
		this.render();
	}

});