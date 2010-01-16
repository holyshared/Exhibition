window.addEvent("domready", function() {
	var exhibition = new Exhibition($("exhibition"), $("exhibition").getElements("li"), {});
	
	$("prev").addEvent("click", function() {
		exhibition.prev();
	});
	$("next").addEvent("click", function() {
		exhibition.next();
	});
	
	
});
