window.addEvent("domready", function() {


	new Tips.Pointy($("exhibition").getElements("li a img"), {
		pointyTipOptions: {
		    point: 12,
		    width: 150,
		    pointyOptions: {
		        closeButton: true
		    }
		}
	});

	var exhibition = new Exhibition.Vertical($("exhibition"), $("exhibition").getElements("li"), {
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
