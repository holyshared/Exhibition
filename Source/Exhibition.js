/*
---
description:

license: MIT-style

authors:
- Noritaka Horio

requires:
- core:1.2.4/ '*'

provides: [Exhibition]
...
*/

var Exhibition = new Class({
	
	Implements: [Events, Options],

	options: {
		"defaultIndex": 0,
		"duration": 300,
		"transition": "expo:out"
	},

	initialize: function (container,sources,options) {
		this.setOptions(options);
		this.container= container;
		this.elements = sources;
		this.tween =  {"duration": this.options.duration, "transition": this.options.transition};
		this.index = this.options.defaultIndex;
		this.calculationStartPosition();
		this.calculationHeight();
		this.adjustment();
		this.render();
		this.setEvents();
	},

	calculationStartPosition: function() {
		this.baseWidth	= this.elements[this.index].getStyle("width").toInt();
		this.maxWidth	= $(this.container).getStyle("width").toInt();
		this.startLeft	= (this.maxWidth / 2) - (this.baseWidth / 2);
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

	calculationMoveValues: function() {
		var moveValues = new Array();

		this.calculationStartPosition();
		this.elements.each(function(e,k) {
			var width = 0, start = e.getPosition().x;
			if (k < this.index) {
				for (var i = k; i < this.index; i++) {
					width -= this.elements[i].getSize().x + 50;
				}
			} else if (k > this.index) {
				for (var i = this.index; i < k; i++) {
					width += this.elements[i].getSize().x + 50;
				}
			}
			moveValues.push([start, this.startLeft + width]);
		}, this);
		return moveValues;
	},

	render: function() {
		this.elements.each(function(e,k) {
			var width = 0;
			if (k < this.index) {
				for (var i = k; i < this.index; i++) {
					width -= this.elements[i].getSize().x + 50;
				}
			} else if (k > this.index) {
				for (var i = this.index; i < k; i++) {
					width += this.elements[i].getSize().x + 50;
				}
			}
			e.setStyle("left", this.startLeft + width);
		}, this);
	},

	adjustment: function(){
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

	next: function() {
		var nextIndex = this.index + 1;
		this.activate(nextIndex);
/*
		this.elements.each(function(e,k) {
			var start = e.getStyle("left").toInt();
			var width = e.getStyle("width").toInt();
//			var end	= start - (width + 50);
			var end	= start - width;
//alert(end);
			var fx = e.get("tween", this.tween);
			fx.start("left", [start, end]);
		}, this);
*/
	},

	prev: function() {
		var prevIndex = this.index - 1;
		this.activate(prevIndex);
	},

	activate: function(index) {
		this.index = index;
		var moveValues = this.calculationMoveValues();
		moveValues.each(function(v,k) {
			var fx = this.elements[k].get("tween", this.tween);
			fx.start("left", v);
		}, this);
	}

});