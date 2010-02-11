/*
---
description:

license: MIT-style

authors:
- Noritaka Horio

requires:
  core/1.2.4:
  - Core/Core
  - Core/Browser
  - Native/Array
  - Native/Function
  - Native/Number
  - Native/String
  - Native/Hash
  - Native/Event
  - Class/Class
  - Class/Class.Extras
  - Element/Element
  - Element/Element.Event
  - Element/Element.Style
  - Element/Element.Dimensions
  - Utilities/Selecter
  - Utilities/DomReady
  - Fx/Fx
  - Fx/Fx.CSS
  - Fx/Fx.Tween
  - Fx/Fx.Morph
  - Fx/Fx.Transitions
more/1.2.4.2:
  - Assets

provides: [Exhibition,Exhibition.Horizontal,Exhibition.Vertical]
...
*/

Exhibition.Vertical = new Class({

	Extends: Exhibition,

	options: {
/*
	onChange: $empty
	onNext: $empty
	onPrev: $empty
*/
		"defaultIndex": 0,
		"duration": 300,
		"transition": "expo:out",
		"blank": 50,
		"height": null
	},

	initialize: function (container,sources,options) {
		this.parent(container,sources,options);
		if (this.options.height) {
			this.container.setStyle("height", this.options.height);
		};
	},

	reset: function() {
		var positions = this.calculation();
		positions.each(function(p,k){
			var e = this.elements[k];
			e.setStyle("top", p.y);
		}, this);
		this.elements.removeClass("active");
		this.elements[this.index].addClass("active");
	},

	calculationWidth: function() {
		this.maxWidth = 0;
		this.baseLeft = 0;
		this.elements.each(function(e,k) {
			var width = e.getSize().x;
			if (this.maxWidth < width) {
				this.maxWidth = width;
				this.baseLeft = width / 2;
			}
		}, this);
	},

	calculation: function() {
		var size = this.container.getSize();
		var x = size.x/2, y = $(document.body).getSize().y/2, t = $(document.body).getSize().y/2;
		var positions = new Array();
		this.elements.each(function(e,k) {
			var size = e.getSize();
			positions.push({x: x, y: t});
			t = t + size.y + this.options.blank;
		}, this);

		var e = this.elements[this.index];
		var m = positions[this.index].y - y + (e.getSize().y/2);
		this.elements.each(function(e,k) {
			positions[k].y = positions[k].y - m;
		});

		return positions;
	},

	adjustment: function(){
		this.calculationWidth();
		this.elements.each(function(e,k) {
			var width = e.getSize().x;
			var margin = this.baseLeft - (width / 2);
			e.setStyle("left", margin);
		}, this);
		this.container.setStyle("width", this.maxWidth);
	},

	render: function() {
		var positions = this.calculation();
		positions.each(function(p,k) {
			var e = this.elements[k];
			var y = e.getPosition().y;
			var fx = e.get("tween", this.tween);
			fx.start("top", [y, p.y]);
		}, this);
	}

});