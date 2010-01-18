window.addEvent("domready", function() {

	$("container").setStyle("height", document.body.getSize().y);
/*
	new Tips.Pointy($("exhibition").getElements("li a img"), {
		pointyTipOptions: {
		    point: 6,
		    width: 200,
		    pointyOptions: {
		        closeButton: true
		    }
		}
	});
*/
	var activeTip = null;
	var exhibition = new Exhibition.Vertical($("exhibition"), $("exhibition").getElements("li"), {
		"onChange": function(index,element) {
			var img = element.getElement("a img");
			var props = $(img).getProperties("title", "alt");
			if (activeTip) { activeTip.hide() };
			activeTip = new StickyWin.PointyTip(props.title, props.alt, {point: 'left', relativeTo: element});
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
