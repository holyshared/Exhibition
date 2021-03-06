/*
---
name: Exhibition.Horizontal

description: The image is arranged horizontally and beautifully and displayed.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Fx.Tween
  - Exhibition/Exhibition

provides: Exhibition.Horizontal
...
*/

(function(Exhibition){

Exhibition.Horizontal = new Class({

	Extends: Exhibition,

	options: {
		"defaultIndex": 0,
		"duration": 300,
		"transition": "expo:out",
		"blank": 50
/*
		onPreload: $empty
		onNext: $empty
		onPrev: $empty
		onSelect: $empty
		onActive: $empty
*/
	},

	initialize: function (container,sources,options) {
		this.parent(container,sources,options);
		delete this.createMatrix;
		delete this.matrix;
	},

	setSize: function() {
		this.container.setStyle("height", this.getMaxHeight(this.elements));
	},

	setDefalutPositions: function() {
		var positions = this.calculation();
		positions.each(function(p,k){
			var e = this.elements[k];
			e.setStyles({"left": p.x, "top": p.y});
			e.set("tween", this.fx);
		}, this);
		this.elements.removeClass("active");
		this.elements[this.index].addClass("active");
	},

	calculation: function() {
		this.calculationPositions();
		this.calculationHeight(this.elements);
		this.calculationCenter();
		return this.positions;
	},

	calculationPositions: function() {
		var size = this.container.getSize();
		var y = 0, l = size.x/2;
		this.positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			this.positions.push({x: l, y: y});
			l = l + size.x + this.options.blank;
		}, this);
	},

	calculationCenter: function() {
		var size = this.container.getSize();
		var x = size.x/2;
		var e = this.elements[this.index];
		var mx = this.positions[this.index].x - x + (e.getSize().x/2);
		this.elements.each(function(e,k) {
			this.positions[k].x = this.positions[k].x - mx;
		}, this);
	},

	render: function() {
		var positions = this.calculation();
		if (this.animate) {
			positions.each(function(p,k) {
				var e = this.elements[k];
				var x = e.getPosition().x;
				var fx = e.get("tween");
				fx.start("left", [x, p.x]);
			}, this);
		}
	}

});

}(Exhibition));