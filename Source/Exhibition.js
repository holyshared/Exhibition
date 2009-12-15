/*
---
description: Element class, Elements class, and basic dom methods.

license: MIT-style

authors:
- Jimmy Dean
- Buck Kingsley

requires:
- localComponent1
- [localComponent2, localComponent3]
- externalPackage1:tag/component1
- externalPackage1:tag: component4
- externalPackage2:tag: [component1, component2]

provides: [Element, Elements, $, $$]

...
*/

window.addEvent("domready", function(){

	var canvasLeft = new Element("canvas", {"id": "left", "width": 139, "height":260}); 
	var canvasRight = new Element("canvas", {"id": "right", "width": 139, "height":260}); 
	canvasLeft.inject($("container"));
	canvasRight.inject($("container"));

 	if ( ! canvasLeft || ! canvasLeft.getContext ) { return false; }
 	var ctx = canvasLeft.getContext("2d");
 	ctx.beginPath();

// 	var grad  = ctx.createLinearGradient(0,0,139,0);
 	var grad  = ctx.createLinearGradient(0,0,100,0);
 	grad.addColorStop(0, "rgba(34, 34, 34, 1)");
 	grad.addColorStop(1, "rgba(34, 34, 34, 0)");
 	ctx.fillStyle = grad;
 	ctx.rect(0,0,139,260);
 	ctx.fill();

 	if ( ! canvasRight || ! canvasRight.getContext ) { return false; }
 	var ctx = canvasRight.getContext("2d");
 	ctx.beginPath();

// 	var grad  = ctx.createLinearGradient(0,0,139,0);
 	var grad  = ctx.createLinearGradient(139,0,39,0);
 	grad.addColorStop(0, "rgba(34, 34, 34, 1)");
 	grad.addColorStop(1, "rgba(34, 34, 34, 0)");
 	ctx.fillStyle = grad;
 	ctx.rect(0,0,139,260);
 	ctx.fill();






	var left = 0, width = 202, maxHeight = 0, baseTop = 0, maxWidth = 0;

	this.element = $("g");
	this.elements = $(this.element).getElements("li");
	this.tween =  {"duration": 1000, "transition": "expo:in:out"};

	maxWidth = $(this.element).getStyle("width").replace("px", "").toInt();

	var startLeft =  (maxWidth / 2) - (width / 2);
//	this.elements[0].setStyle("left", startLeft);

	left = startLeft;
	this.elements.each(function(e,k) {
		var y			= e.getPosition().y;
		var height	= e.getSize().y;
		if (maxHeight < height) {
			maxHeight = height;
			baseTop = height / 2;
		}
		e.setStyle("left", left);
		left = left + width + 50;
	});


	this.elements.each(function(e,k) {
		var height = e.getSize().y;
		var margin = baseTop - (height / 2);
		e.setStyle("top", margin);
	});

	this.element.setStyle("height", maxHeight);


	this.elements.each(function(e,k) {
		var a = $(e).getElement("a");
		a.addEvent("click", function(index) {
			this.activate(index);
		}.bind(this, [k]));
	});



	this.activate = function(index) {

		var slideX = new Array();
		this.elements.each(function(e,k) {
			var start = e.getStyle("left").replace("px", "").toInt();
			if (k < index) {
				var diff = index - k;
				var end = startLeft - (width + 50) * diff;
			} else if (k > index) {
				var diff = k - index;
				var end = startLeft + (width + 50) * diff;
			} else {
				end = startLeft;
			}
			slideX.push([start, end]);
		});

		this.elements.each(function(e,k) {
			var fx = e.get("tween", this.tween);
			fx.start("left", slideX[k]);
		});

	}.bind(this)





	$("next").addEvent("click", function(){

		this.elements.each(function(e,k) {
			var start	= e.getStyle("left").replace("px", "").toInt();
			var end	= start - (width + 50);
			var fx = e.get("tween", this.tween);
			fx.start("left", [start, end]);
		}.bind(this));

	}.bind(this));
	
	$("prev").addEvent("click", function(){

		this.elements.each(function(e,k) {
			var start	= e.getStyle("left").replace("px", "").toInt();
			var end	= start + (width + 50);
			var fx = e.get("tween", this.tween);
			fx.start("left", [start, end]);
		}.bind(this));

	}.bind(this));
	
	
});
