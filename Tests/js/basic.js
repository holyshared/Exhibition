window.addEvent("domready", function() {
	var container = $("container");
	var exhibition = $("exhibition");

	container.setStyle("height", window.innerHeight);
	exhibition.setStyle("height", window.innerHeight);
	
	var images = exhibition.getElements("li");
	new Exhibition(exhibition, images, {"defaultIndex": Math.round((images.length - 1)/2)});

});
