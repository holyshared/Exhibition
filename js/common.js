(function(){
	SyntaxHighlighter.config.clipboardSwf = 'js/libraries/highlighter/clipboard.swf';
	SyntaxHighlighter.all();

	window.addEvent("domready", function(){
		var tabs = new MGFX.Tabs('.tab','.section', {});
	});


}());