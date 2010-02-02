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

Exhibition.Horizontal = new Class({

	Extends: Exhibition,

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
		this.parent(container,sources,options);
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

	render: function() {
		var positions = this.calculation();
		positions.each(function(p,k) {
			var e = this.elements[k];
			var x = e.getPosition().x;
			var fx = e.get("tween", this.tween);
			fx.start("left", [x, p.x]);
		}, this);
	}

});