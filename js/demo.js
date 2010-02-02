window.addEvent("domready", function() {

	$("container").setStyle("height", window.innerHeight);

	var exhibitions = $$("ul.exhibition");
	exhibitions.each(function(element, key) {
		var container = element;
		var images = element.getElements("li");
		new Exhibition.Horizontal(container, images, {"defaultIndex": Math.round(images.length/2)});
	});
	

});
