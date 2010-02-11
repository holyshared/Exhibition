window.addEvent("domready", function() {
	var container = $("container");
	var exhibition = $("exhibition");

	var images = exhibition.getElements("li");
	new Exhibition.Horizontal(exhibition, images, {"defaultIndex": Math.round((images.length - 1)/2)});

});
