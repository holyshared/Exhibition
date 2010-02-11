window.addEvent("domready", function() {

	var height = (Browser.Engine.trident && Browser.Engine.version <= 6) ? document.documentElement.clientHeight : window.innerHeight;
	var container = $("container");
	var exhibition = $("exhibition");

	container.setStyle("height", height);
	exhibition.setStyle("height", height);

	var images = exhibition.getElements("li");
	new Exhibition(exhibition, images, {"defaultIndex": Math.round((images.length - 1)/2)});

});
