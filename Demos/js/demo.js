window.addEvent("domready", function() {

	var exhibition = new Exhibition($("exhibition"), $("exhibition").getElements("li"), {
		"onChange": function(index,element) {
		},
		"onNext": function(index,element) {
		},
		"onPrev": function(index,element) {
		}
	});
	
	$("prev").addEvent("click", function() {
		exhibition.prev();
	});

	$("next").addEvent("click", function() {
		exhibition.next();
	});
	
	
});
