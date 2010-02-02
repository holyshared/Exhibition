/* Clientcide Copyright (c) 2006-2009, http://www.clientcide.com/wiki/cnet-libraries#license*/

//Contents: Clientcide, Class.ToElement, dbug, StyleWriter, StickyWin, StickyWin.Fx, StickyWin.Modal, StickyWin.UI, StickyWin.UI.Pointy, StickyWin.PointyTip, Tips.Pointy

//This lib: http://www.clientcide.com/js/build.php?excludeLibs[]=mootools-core&excludeLibs[]=mootools-more&require[]=Clientcide&require[]=StickyWin.Fx&require[]=StickyWin.Modal&require[]=Tips.Pointy&compression=none

/*
Script: Clientcide.js
	The Clientcide namespace.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Clientcide = {
	version: '%build%',
	assetLocation: "http://github.com/anutron/clientcide/raw/master/Assets",
	setAssetLocation: function(baseHref) {
		Clientcide.assetLocation = baseHref;
		if (Clientcide.preloaded) Clientcide.preLoadCss();
	},
	preLoadCss: function(){
		if (window.StickyWin && StickyWin.ui) StickyWin.ui();
		if (window.StickyWin && StickyWin.pointy) StickyWin.pointy();
		Clientcide.preloaded = true;
		return true;
	},
	preloaded: false
};
(function(){
	if (!window.addEvent) return;
	var preload = function(){
		if (window.dbug) dbug.log('preloading clientcide css');
		if (!Clientcide.preloaded) Clientcide.preLoadCss();
	};
	window.addEvent('domready', preload);
	window.addEvent('load', preload);
})();
setCNETAssetBaseHref = Clientcide.setAssetLocation;/*
Script: ToElement.js
	Defines the toElement method for a class.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Class.ToElement = new Class({
	toElement: function(){
		return this.element;
	}
});
var ToElement = Class.ToElement;/*
Script: dbug.js
	A wrapper for Firebug console.* statements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var dbug = {
	logged: [],	
	timers: {},
	firebug: false, 
	enabled: false, 
	log: function() {
		dbug.logged.push(arguments);
	},
	nolog: function(msg) {
		dbug.logged.push(arguments);
	},
	time: function(name){
		dbug.timers[name] = new Date().getTime();
	},
	timeEnd: function(name){
		if (dbug.timers[name]) {
			var end = new Date().getTime() - dbug.timers[name];
			dbug.timers[name] = false;
			dbug.log('%s: %s', name, end);
		} else dbug.log('no such timer: %s', name);
	},
	enable: function(silent) { 
		var con = window.firebug ? firebug.d.console.cmd : window.console;

		if((!!window.console && !!window.console.warn) || window.firebug) {
			try {
				dbug.enabled = true;
				dbug.log = function(){
						try {
							(con.debug || con.log).apply(con, arguments);
						} catch(e) {
							console.log(Array.slice(arguments));
						}
				};
				dbug.time = function(){
					con.time.apply(con, arguments);
				};
				dbug.timeEnd = function(){
					con.timeEnd.apply(con, arguments);
				};
				if(!silent) dbug.log('enabling dbug');
				for(var i=0;i<dbug.logged.length;i++){ dbug.log.apply(con, dbug.logged[i]); }
				dbug.logged=[];
			} catch(e) {
				dbug.enable.delay(400);
			}
		}
	},
	disable: function(){ 
		if(dbug.firebug) dbug.enabled = false;
		dbug.log = dbug.nolog;
		dbug.time = function(){};
		dbug.timeEnd = function(){};
	},
	cookie: function(set){
		var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
		var debugCookie = value ? unescape(value[1]) : false;
		if((!$defined(set) && debugCookie != 'true') || ($defined(set) && set)) {
			dbug.enable();
			dbug.log('setting debugging cookie');
			var date = new Date();
			date.setTime(date.getTime()+(24*60*60*1000));
			document.cookie = 'jsdebug=true;expires='+date.toGMTString()+';path=/;';
		} else dbug.disableCookie();
	},
	disableCookie: function(){
		dbug.log('disabling debugging cookie');
		document.cookie = 'jsdebug=false;path=/;';
	}
};

(function(){
	var fb = !!window.console || !!window.firebug;
	var con = window.firebug ? window.firebug.d.console.cmd : window.console;
	var debugMethods = ['debug','info','warn','error','assert','dir','dirxml'];
	var otherMethods = ['trace','group','groupEnd','profile','profileEnd','count'];
	function set(methodList, defaultFunction) {
		for(var i = 0; i < methodList.length; i++){
			dbug[methodList[i]] = (fb && con[methodList[i]])?con[methodList[i]]:defaultFunction;
		}
	};
	set(debugMethods, dbug.log);
	set(otherMethods, function(){});
})();
if ((!!window.console && !!window.console.warn) || window.firebug){
	dbug.firebug = true;
	var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
	var debugCookie = value ? unescape(value[1]) : false;
	if(window.location.href.indexOf("jsdebug=true")>0 || debugCookie=='true') dbug.enable();
	if(debugCookie=='true')dbug.log('debugging cookie enabled');
	if(window.location.href.indexOf("jsdebugCookie=true")>0){
		dbug.cookie();
		if(!dbug.enabled)dbug.enable();
	}
	if(window.location.href.indexOf("jsdebugCookie=false")>0)dbug.disableCookie();
}/*
Script: StyleWriter.js

Provides a simple method for injecting a css style element into the DOM if it's not already present.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StyleWriter = new Class({
	createStyle: function(css, id) {
		window.addEvent('domready', function(){
			try {
				if (document.id(id) && id) return;
				var style = new Element('style', {id: id||''}).inject($$('head')[0]);
				if (Browser.Engine.trident) style.styleSheet.cssText = css;
				else style.set('text', css);
			}catch(e){dbug.log('error: %s',e);}
		}.bind(this));
	}
});/*
Script: StickyWin.js

Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/


var StickyWin = new Class({
	Binds: ['destroy', 'hide', 'togglepin', 'esc'],
	Implements: [Options, Events, StyleWriter, Class.ToElement],
	options: {
//		onDisplay: $empty,
//		onClose: $empty,
//		onDestroy: $empty,
		closeClassName: 'closeSticky',
		pinClassName: 'pinSticky',
		content: '',
		zIndex: 10000,
		className: '',
//		id: ... set above in initialize function
/*  	these are the defaults for Element.position anyway
		************************************************
		edge: false, //see Element.position
		position: 'center', //center, corner == upperLeft, upperRight, bottomLeft, bottomRight
		offset: {x:0,y:0},
		relativeTo: document.body, */
		width: false,
		height: false,
		timeout: -1,
		allowMultipleByClass: true,
		allowMultiple: true,
		showNow: true,
		useIframeShim: true,
		iframeShimSelector: '',
		destroyOnClose: false,
		closeOnClickOut: false,
		closeOnEsc: false,
		getWindowManager: function(){ return StickyWin.WM; }
	},

	css: '.SWclearfix:after {content: "."; display: block; height: 0; clear: both; visibility: hidden;}'+
		 '.SWclearfix {display: inline-table;} * html .SWclearfix {height: 1%;} .SWclearfix {display: block;}',
	
	initialize: function(options){
		this.options.inject = this.options.inject || {
			target: document.body,
			where: 'bottom'
		};
		this.setOptions(options);
		this.windowManager = this.options.getWindowManager();
		this.id = this.options.id || 'StickyWin_'+new Date().getTime();
		this.makeWindow();
		if (this.windowManager) this.windowManager.add(this);

		if (this.options.content) this.setContent(this.options.content);
		if (this.options.timeout > 0) {
			this.addEvent('onDisplay', function(){
				this.hide.delay(this.options.timeout, this);
			}.bind(this));
		}
		//add css for clearfix
		this.createStyle(this.css, 'StickyWinClearFix');
		if (this.options.closeOnClickOut || this.options.closeOnEsc) this.attach();
		if (this.options.destroyOnClose) this.addEvent('close', this.destroy);
		if (this.options.showNow) this.show();
	},
	attach: function(attach){
		var method = $pick(attach, true) ? 'addEvents' : 'removeEvents';
		var events = {};
		if (this.options.closeOnClickOut) events.click = this.esc;
		if (this.options.closeOnEsc) events.keyup = this.esc;
		document[method](events);
	},
	esc: function(e) {
		if (e.key == "esc") this.hide();
		if (e.type == "click" && this.element != e.target && !this.element.hasChild(e.target)) this.hide();
	},
	makeWindow: function(){
		this.destroyOthers();
		if (!document.id(this.id)) {
			this.win = new Element('div', {
				id:		this.id
			}).addClass(this.options.className).addClass('StickyWinInstance').addClass('SWclearfix').setStyles({
			 	display:'none',
				position:'absolute',
				zIndex:this.options.zIndex
			}).inject(this.options.inject.target, this.options.inject.where).store('StickyWin', this);			
		} else this.win = document.id(this.id);
		this.element = this.win;
		if (this.options.width && $type(this.options.width.toInt())=="number") this.win.setStyle('width', this.options.width.toInt());
		if (this.options.height && $type(this.options.height.toInt())=="number") this.win.setStyle('height', this.options.height.toInt());
		return this;
	},
	show: function(suppressEvent){
		this.showWin();
		if (!suppressEvent) this.fireEvent('display');
		if (this.options.useIframeShim) this.showIframeShim();
		this.visible = true;
		return this;
	},
	showWin: function(){
		if (this.windowManager) this.windowManager.focus(this);
		if (!this.positioned) this.position();
		this.win.show();
	},
	hide: function(suppressEvent){
		if ($type(suppressEvent) == "event" || !suppressEvent) this.fireEvent('close');
		this.hideWin();
		if (this.options.useIframeShim) this.hideIframeShim();
		this.visible = false;
		return this;
	},
	hideWin: function(){
		this.win.setStyle('display','none');
	},
	destroyOthers: function() {
		if (!this.options.allowMultipleByClass || !this.options.allowMultiple) {
			$$('div.StickyWinInstance').each(function(sw) {
				if (!this.options.allowMultiple || (!this.options.allowMultipleByClass && sw.hasClass(this.options.className))) 
					sw.retrieve('StickyWin').destroy();
			}, this);
		}
	},
	setContent: function(html) {
		if (this.win.getChildren().length>0) this.win.empty();
		if ($type(html) == "string") this.win.set('html', html);
		else if (document.id(html)) this.win.adopt(html);
		this.win.getElements('.'+this.options.closeClassName).each(function(el){
			el.addEvent('click', this.hide);
		}, this);
		this.win.getElements('.'+this.options.pinClassName).each(function(el){
			el.addEvent('click', this.togglepin);
		}, this);
		return this;
	},
	position: function(options){
		this.positioned = true;
		this.setOptions(options);
		this.win.position({
			allowNegative: $pick(this.options.allowNegative, this.options.relativeTo != document.body),
			relativeTo: this.options.relativeTo,
			position: this.options.position,
			offset: this.options.offset,
			edge: this.options.edge
		});
		if (this.shim) this.shim.position();
		return this;
	},
	pin: function(pin) {
		if (!this.win.pin) {
			dbug.log('you must include element.pin.js!');
			return this;
		}
		this.pinned = $pick(pin, true);
		this.win.pin(pin);
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		return this.pin(!this.pinned);
	},
	makeIframeShim: function(){
		if (!this.shim){
			var el = (this.options.iframeShimSelector)?this.win.getElement(this.options.iframeShimSelector):this.win;
			this.shim = new IframeShim(el, {
				display: false,
				name: 'StickyWinShim'
			});
		}
	},
	showIframeShim: function(){
		if (this.options.useIframeShim) {
			this.makeIframeShim();
			this.shim.show();
		}
	},
	hideIframeShim: function(){
		if (this.shim) this.shim.hide();
	},
	destroy: function(){
		if (this.windowManager) this.windowManager.remove(this);
		if (this.win) this.win.destroy();
		if (this.options.useIframeShim && this.shim) this.shim.destroy();
		if (document.id('modalOverlay')) document.id('modalOverlay').destroy();
		this.fireEvent('destroy');
	}
});

StickyWin.Stacker = new Class({
	Implements: [Options, Events],
	Binds: ['click'],
	instances: [],
	options: {
		zIndexBase: 9000
	},
	initialize: function(options) {
		this.setOptions(options);
		this.zIndex = this.options.zIndex;
	},
	add: function(sw) {
		this.instances.include(sw);
		$(sw).addEvent('mousedown', this.click);
	},
	click: function(e) {
		this.instances.each(function(sw){
			var el = $(sw);
			if (el == e.target || el.hasChild($(e.target))) this.focus(sw);
		}, this);
	},
	focus: function(instance){
		if (this.focused == instance) return;
		this.focused = instance;
		if (instance) this.instances.erase(instance).push(instance);
		this.instances.each(function(current, i){
			$(current).setStyle('z-index', this.options.zIndexBase + i);
		}, this);
		this.focused = instance;
	},
	remove: function(sw) {
		this.instances.erase(sw);
		$(sw).removeEvent('click', this.click);
	}
});
StickyWin.WM = new StickyWin.Stacker();/*
Script: StickyWin.Fx.js

	Extends StickyWin to create popups that fade in and out.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

/*
Script: StickyWin.Fx.js

Extends StickyWin to create popups that fade in and out and can be dragged and resized (requires StickyWin.Fx.Drag.js).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin = Class.refactor(StickyWin, {
	options: {
		//fadeTransition: 'sine:in:out',
		fade: true,
		fadeDuration: 150
	},
	hideWin: function(){
		if (this.options.fade) this.fade(0);
		else this.previous();
	},
	showWin: function(){
		if (this.options.fade) this.fade(1);
		else this.previous();
	},
	hide: function(){
		this.previous(this.options.fade);
	},
	show: function(){
		this.previous(this.options.fade);
	},
	fade: function(to){
		if (!this.fadeFx) {
			this.win.setStyles({
				opacity: 0,
				display: 'block'
			});
			var opts = {
				property: 'opacity',
				duration: this.options.fadeDuration
			};
			if (this.options.fadeTransition) opts.transition = this.options.fadeTransition;
			this.fadeFx = new Fx.Tween(this.win, opts);
		}
		if (to > 0) {
			this.win.setStyle('display','block');
			this.position();
		}
		this.fadeFx.clearChain();
		this.fadeFx.start(to).chain(function (){
			if (to == 0) {
				this.win.setStyle('display', 'none');
				this.fireEvent('onClose');
			} else {
				this.fireEvent('onDisplay');
			}
		}.bind(this));
		return this;
	}
});
StickyWin.Fx = StickyWin;/*
Script: StickyWin.Modal.js

This script extends StickyWin and StickyWin.Fx classes to add Mask functionality.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.Modal = new Class({

	Extends: StickyWin,

	options: {
		modalize: true,
		maskOptions: {
			style: {
				'background-color':'#333',
				opacity:0.8
			}
		},
		hideOnClick: true,
		getWindowManager: function(){ return StickyWin.ModalWM; }
	},

	initialize: function(options) {
		this.options.maskTarget = this.options.maskTarget || document.body;
		this.setOptions(options);
		this.mask = new Mask(this.options.maskTarget, this.options.maskOptions).addEvent('click', function() {
			if (this.options.hideOnClick) this.hide();
		}.bind(this));
		this.parent(options);
	},

	show: function(showModal){
		if ($pick(showModal, this.options.modalize)) this.mask.show();
		this.parent();
	},

	hide: function(hideModal){
		if ($pick(hideModal, true)) this.mask.hide();
		this.parent();
	}

});

StickyWin.ModalWM = new StickyWin.Stacker({
	zIndexBase: 11000
});
if (StickyWin.Fx) StickyWin.Fx.Modal = StickyWin.Modal; /*
Script: StickyWin.ui.js

Creates an html holder for in-page popups using a default style.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI = new Class({
	Implements: [Options, Class.ToElement, StyleWriter],
	options: {
		width: 300,
		css: "div.DefaultStickyWin {font-family:verdana; font-size:11px; line-height: 13px;position: relative;}"+
			"div.DefaultStickyWin div.top{-moz-user-select: none;-khtml-user-select: none;}"+
			"div.DefaultStickyWin div.top_ul{background:url({%baseHref%}full.png) top left no-repeat; height:30px; width:15px; float:left}"+
			"div.DefaultStickyWin div.top_ur{position:relative; left:0px !important; left:-4px; background:url({%baseHref%}full.png) top right !important; height:30px; margin:0px 0px 0px 15px !important; margin-right:-4px; padding:0px}"+
			"div.DefaultStickyWin h1.caption{clear: none !important; margin:0px !important; overflow: hidden; padding:0 !important; font-weight:bold; color:#555; font-size:14px !important; position:relative; top:8px !important; left:5px !important; float: left; height: 22px !important;}"+
			"div.DefaultStickyWin div.middle, div.DefaultStickyWin div.closeBody {background:url({%baseHref%}body.png) top left repeat-y; margin:0px 20px 0px 0px !important;	margin-bottom: -3px; position: relative;	top: 0px !important; top: -3px;}"+
			"div.DefaultStickyWin div.body{background:url({%baseHref%}body.png) top right repeat-y; padding:8px 23px 8px 0px !important; margin-left:5px !important; position:relative; right:-20px !important; z-index: 1;}"+
			"div.DefaultStickyWin div.bottom{clear:both;}"+
			"div.DefaultStickyWin div.bottom_ll{background:url({%baseHref%}full.png) bottom left no-repeat; width:15px; height:15px; float:left}"+
			"div.DefaultStickyWin div.bottom_lr{background:url({%baseHref%}full.png) bottom right; position:relative; left:0px !important; left:-4px; margin:0px 0px 0px 15px !important; margin-right:-4px; height:15px}"+
			"div.DefaultStickyWin div.closeButtons{text-align: center; background:url({%baseHref%}body.png) top right repeat-y; padding: 4px 30px 8px 0px; margin-left:5px; position:relative; right:-20px}"+
			"div.DefaultStickyWin a.button:hover{background:url({%baseHref%}big_button_over.gif) repeat-x}"+
			"div.DefaultStickyWin a.button {background:url({%baseHref%}big_button.gif) repeat-x; margin: 2px 8px 2px 8px; padding: 2px 12px; cursor:pointer; border: 1px solid #999 !important; text-decoration:none; color: #000 !important;}"+
			"div.DefaultStickyWin div.closeButton{width:13px; height:13px; background:url({%baseHref%}closebtn.gif) no-repeat; position: absolute; right: 0px; margin:10px 15px 0px 0px !important; cursor:pointer;top:0px}"+
			"div.DefaultStickyWin div.dragHandle {	width: 11px;	height: 25px;	position: relative;	top: 5px;	left: -3px;	cursor: move;	background: url({%baseHref%}drag_corner.gif); float: left;}",
		cornerHandle: false,
		cssClass: '',
		buttons: [],
		cssId: 'defaultStickyWinStyle',
		cssClassName: 'DefaultStickyWin',
		closeButton: true
/*	These options are deprecated:
		closeTxt: false,
		onClose: $empty,
		confirmTxt: false,
		onConfirm: $empty	*/
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		this.legacy();
		var css = this.options.css.substitute({baseHref: this.options.baseHref || Clientcide.assetLocation + '/stickyWinHTML/'}, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) css = css.replace(/png/g, 'gif');
		this.createStyle(css, this.options.cssId);
		this.build();
		if (args.caption || args.body) this.setContent(args.caption, args.body);
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	legacy: function(){
		var opt = this.options; //saving bytes
		//legacy support
		if (opt.confirmTxt) opt.buttons.push({text: opt.confirmTxt, onClick: opt.onConfirm || $empty});
		if (opt.closeTxt) opt.buttons.push({text: opt.closeTxt, onClick: opt.onClose || $empty});
	},
	build: function(){
		var opt = this.options;

		var container = new Element('div', {
			'class': opt.cssClassName
		});
		if (opt.width) container.setStyle('width', opt.width);
		this.element = container;
		this.element.store('StickyWinUI', this);
		if (opt.cssClass) container.addClass(opt.cssClass);
		

		var bodyDiv = new Element('div').addClass('body');
		this.body = bodyDiv;
		
		var top_ur = new Element('div').addClass('top_ur');
		this.top_ur = top_ur;
		this.top = new Element('div').addClass('top').adopt(
				new Element('div').addClass('top_ul')
			).adopt(top_ur);
		container.adopt(this.top);
		
		if (opt.cornerHandle) new Element('div').addClass('dragHandle').inject(top_ur, 'top');
		
		//body
		container.adopt(new Element('div').addClass('middle').adopt(bodyDiv));
		//close buttons
		if (opt.buttons.length > 0){
			var closeButtons = new Element('div').addClass('closeButtons');
			opt.buttons.each(function(button){
				if (button.properties && button.properties.className){
					button.properties['class'] = button.properties.className;
					delete button.properties.className;
				}
				var properties = $merge({'class': 'closeSticky'}, button.properties);
				new Element('a').addEvent('click', button.onClick || $empty)
					.appendText(button.text).inject(closeButtons).set(properties).addClass('button');
			});
			container.adopt(new Element('div').addClass('closeBody').adopt(closeButtons));
		}
		//footer
		container.adopt(
			new Element('div').addClass('bottom').adopt(
					new Element('div').addClass('bottom_ll')
				).adopt(
					new Element('div').addClass('bottom_lr')
			)
		);
		if (this.options.closeButton) container.adopt(new Element('div').addClass('closeButton').addClass('closeSticky'));
		return this;
	},
	setCaption: function(caption) {
		this.caption = caption;
		if (!this.h1) {
			this.makeCaption(caption);
		} else {
			if (document.id(caption)) this.h1.adopt(caption);
			else this.h1.set('html', caption);
		}
		return this;
	},
	makeCaption: function(caption) {
		if (!caption) return this.destroyCaption();
		var opt = this.options;
		this.h1 = new Element('h1').addClass('caption');
		if (opt.width) this.h1.setStyle('width', (opt.width-(opt.cornerHandle?55:40)-(opt.closeButton?10:0)));
		this.setCaption(caption);
		this.top_ur.adopt(this.h1);
		if (!this.options.cornerHandle) this.h1.addClass('dragHandle');
		return this;
	},
	destroyCaption: function(){
		if (this.h1) {
			this.h1.destroy();
			this.h1 = null;
		}
		return this;
	},
	setContent: function(){
		var args = this.getArgs.apply(this, arguments);
		var caption = args.caption;
		var body = args.body;
		this.setCaption(caption);
		if (document.id(body)) this.body.empty().adopt(body);
		else this.body.set('html', body);
		return this;
	}
});
StickyWin.UI.getArgs = function(){
	var input = $type(arguments[0]) == "arguments"?arguments[0]:arguments;
	if (Browser.Engine.presto && 1 === input.length) input = input[0];

	var cap = input[0], bod = input[1];
	var args = Array.link(input, {options: Object.type});
	if (input.length == 3 || (!args.options && input.length == 2)) {
		args.caption = cap;
		args.body = bod;
	} else if (($type(bod) == 'object' || !bod) && cap && $type(cap) != 'object'){
		args.body = cap;
	}
	return args;
};

StickyWin.ui = function(caption, body, options){
	return document.id(new StickyWin.UI(caption, body, options));
};
/*
Script: StickyWin.UI.Pointy.js

Creates an html holder for in-page popups using a default style - this one including a pointer in the specified direction.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.UI.Pointy = new Class({
	Extends: StickyWin.UI,
	options: {
		theme: 'dark',
		themes: {
			dark: {
				bgColor: '#333',
				fgColor: '#ddd',
				imgset: 'dark'
			},
			light: {
				bgColor: '#ccc',
				fgColor: '#333',
				imgset: 'light'
			}
		},
		css: "div.DefaultPointyTip {vertical-align: auto; position: relative;}"+
		"div.DefaultPointyTip * {text-align:left !important}"+
		"div.DefaultPointyTip .pointyWrapper div.body{background: {%bgColor%}; color: {%fgColor%}; left: 0px; right: 0px !important;padding:  0px 10px !important;margin-left: 0px !important;font-family: verdana;font-size: 11px;line-height: 13px;position: relative;}"+
		"div.DefaultPointyTip .pointyWrapper div.top {position: relative;height: 25px; overflow: visible;}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ul{background: url({%baseHref%}{%imgset%}_back.png) top left no-repeat;width: 8px;height: 25px; position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.top_ur{background: url({%baseHref%}{%imgset%}_back.png) top right !important;margin: 0 0 0 8px !important;height: 25px;position: relative;left: 0px !important;padding: 0;}"+
		"div.DefaultPointyTip .pointyWrapper h1.caption{color: {%fgColor%};left: 0px !important;top: 4px !important;clear: none !important;overflow: hidden;font-weight: 700;font-size: 12px !important;position: relative;float: left;height: 22px !important;margin: 0 !important;padding: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.middle, div.DefaultPointyTip .pointyWrapper div.closeBody{background:  {%bgColor%};margin: 0 0px 0 0 !important;position: relative;top: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom {clear: both; width: 100% !important; background: none; height: 6px} "+
		"div.DefaultPointyTip .pointyWrapper div.bottom_ll{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom left no-repeat;width: 6px;height: 6px;position: absolute; left: 0px;}"+
		"div.DefaultPointyTip .pointyWrapper div.bottom_lr{font-size:1; background: url({%baseHref%}{%imgset%}_back.png) bottom right;height: 6px;margin: 0 0 0 6px !important;position: relative;left: 0 !important;}"+
		"div.DefaultPointyTip .pointyWrapper div.noCaption{ height: 6px; overflow: hidden}"+
		"div.DefaultPointyTip .pointyWrapper div.closeButton{width:13px; height:13px; background:url({%baseHref%}{%imgset%}_x.png) no-repeat; position: absolute; right: 0px; margin:0px !important; cursor:pointer; z-index: 1; top: 4px;}"+
		"div.DefaultPointyTip .pointyWrapper div.pointyDivot {background: url({%divot%}) no-repeat;}",
		divot: '{%baseHref%}{%imgset%}_divot.png',
		divotSize: 22,
		direction: 12,
		cssId: 'defaultPointyTipStyle',
		cssClassName: 'DefaultPointyTip'
	},
	initialize: function() {
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		$extend(this.options, this.options.themes[this.options.theme]);
		this.options.baseHref = this.options.baseHref || Clientcide.assetLocation + '/PointyTip/';
		this.options.divot = this.options.divot.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (Browser.Engine.trident4) this.options.divot = this.options.divot.replace(/png/g, 'gif');
		this.options.css = this.options.css.substitute(this.options, /\\?\{%([^}]+)%\}/g);
		if (args.options && args.options.theme) {
			while (!this.id) {
				var id = $random(0, 999999999);
				if (!StickyWin.UI.Pointy[id]) {
					StickyWin.UI.Pointy[id] = this;
					this.id = id;
				}
			}
			this.options.css = this.options.css.replace(/div\.DefaultPointyTip/g, "div#pointy_"+this.id);
			this.options.cssId = "pointyTipStyle_" + this.id;
		}
		if ($type(this.options.direction) == 'string') {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			this.options.direction = map[this.options.direction];
		}
		
		this.parent(args.caption, args.body, this.options);
		if (this.id) document.id(this).set('id', "pointy_"+this.id);
	},
	build: function(){
		this.parent();
		var opt = this.options;
		this.pointyWrapper = new Element('div', {
			'class': 'pointyWrapper'
		}).inject(document.id(this));
		document.id(this).getChildren().each(function(el){
			if (el != this.pointyWrapper) this.pointyWrapper.grab(el);
		}, this);

		var w = opt.divotSize;
		var h = w;
		var left = (opt.width - opt.divotSize)/2;
		var orient = function(){
			switch(opt.direction) {
				case 12: case 1: case 11:
					return {
						height: h/2
					};
				case 5: case 6: case 7:
					return {
						height: h/2,
						backgroundPosition: '0 -'+h/2+'px'
					};
				case 8: case 9: case 10:
					return {
						width: w/2
					};
				case 2: case 3: case 4:
					return {
						width: w/2,
						backgroundPosition: '100%'
					};
			};
		};
		this.pointer = new Element('div', {
			styles: $extend({
				width: w,
				height: h,
				overflow: 'hidden'
			}, orient()),
			'class': 'pointyDivot pointy_'+opt.direction
		}).inject(this.pointyWrapper);
	},
	expose: function(){
		if (document.id(this).getStyle('display') != 'none' && document.id(document.body).hasChild(document.id(this))) return $empty;
		document.id(this).setStyles({
			visibility: 'hidden',
			position: 'absolute'
		});
		var dispose;
		if (!document.body.hasChild(document.id(this))) {
			document.id(this).inject(document.body);
			dispose = true;
		}
		return (function(){
			if (dispose) document.id(this).dispose();
			document.id(this).setStyles({
				visibility: 'visible',
				position: 'relative'
			});
		}).bind(this);
	},
	positionPointer: function(options){
		if (!this.pointer) return;
		var opt = options || this.options;
		var pos;
		var d = opt.direction;
		switch (d){
			case 12: case 1: case 11:
				pos = {
					edge: {x: 'center', y: 'bottom'},
					position: {
						x: d==12?'center':d==1?'right':'left', 
						y: 'top'
					},
					offset: {
						x: (d==12?0:d==1?-1:1)*opt.divotSize,
						y: 1
					}
				};
				break;
			case 2: case 3: case 4:
				pos = {
					edge: {x: 'left', y: 'center'},
					position: {
						x: 'right', 
						y: d==3?'center':d==2?'top':'bottom'
					},
					offset: {
						x: -1,
						y: (d==3?0:d==4?-1:1)*opt.divotSize
					}
				};
				break;
			case 5: case 6: case 7:
				pos = {
					edge: {x: 'center', y: 'top'},
					position: {
						x: d==6?'center':d==5?'right':'left', 
						y: 'bottom'
					},
					offset: {
						x: (d==6?0:d==5?-1:1)*opt.divotSize,
						y: -1
					}
				};
				break;
			case 8: case 9: case 10:
				pos = {
					edge: {x: 'right', y: 'center'},
					position: {
						x: 'left', 
						y: d==9?'center':d==10?'top':'bottom'
					},
					offset: {
						x: 1,
						y: (d==9?0:d==8?-1:1)*opt.divotSize
					}
				};
				break;
		};
		var putItBack = this.expose();
		this.pointer.position($extend({
			relativeTo: this.pointyWrapper
		}, pos, options));
		putItBack();
	},
	setContent: function(a1, a2){
		this.parent(a1, a2);
		this.top[this.h1?'removeClass':'addClass']('noCaption');
		if (Browser.Engine.trident4) document.id(this).getElements('.bottom_ll, .bottom_lr').setStyle('font-size', 1); //IE6 bullshit
		if (this.options.closeButton) this.body.setStyle('margin-right', 6);
		this.positionPointer();
		return this;
	},
	makeCaption: function(caption){
		this.parent(caption);
		if (this.options.width && this.h1) this.h1.setStyle('width', (this.options.width-(this.options.closeButton?25:15)));
	}
});

StickyWin.UI.pointy = function(caption, body, options){
	return document.id(new StickyWin.UI.Pointy(caption, body, options));
};
StickyWin.ui.pointy = StickyWin.UI.pointy;/*
Script: StickyWin.PointyTip.js
	Positions a pointy tip relative to the element you specify.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
StickyWin.PointyTip = new Class({
	Extends: StickyWin,
	options: {
		point: "left",
		pointyOptions: {}
	},
	initialize: function(){
		var args = this.getArgs(arguments);
		this.setOptions(args.options);
		var popts = this.options.pointyOptions;
		var d = popts.direction;
		if (!d) {
			var map = {
				left: 9,
				right: 3,
				up: 12,
				down: 6
			};
			d = map[this.options.point];
			if (!d) d = this.options.point;
			popts.direction = d;
		}
		if (!popts.width) popts.width = this.options.width;
		this.pointy = new StickyWin.UI.Pointy(args.caption, args.body, popts);
		this.options.content = null;
		this.setOptions(args.options, this.getPositionSettings());
		this.parent(this.options);
		this.win.empty().adopt(document.id(this.pointy));
		this.attachHandlers(this.win);
		if (this.options.showNow) this.position();
	},
	getArgs: function(){
		return StickyWin.UI.getArgs.apply(this, arguments);
	},
	getPositionSettings: function(){
		var s = this.pointy.options.divotSize;
		var d = this.options.point;
		var offset = this.options.offset || {};
		switch(d) {
			case "left": case 8: case 9: case 10:
				return {
					edge: {
						x: 'left', 
						y: d==10?'top':d==8?'bottom':'center'
					},
					position: {x: 'right', y: 'center'},
					offset: {
						x: s + (offset.x || 0),
						y: offset.y || 0
					}
				};
			case "right": case 2:  case 3: case 4:
				return {
					edge: {
						x: 'right', 
						y: (d==2?'top':d==4?'bottom':'center') + (offset.y || 0)
					},
					position: {x: 'left', y: 'center'},
					offset: {
						x: -s + (offset.x || 0),
						y: offset.y || 0
					}
				};
			case "up": case 11: case 12: case 1:
				return {
					edge: { 
						x: d==11?'left':d==1?'right':'center', 
						y: 'top' 
					},
					position: {	x: 'center', y: 'bottom' },
					offset: {
						y: s + (offset.y || 0),
						x: (d==11?-s:d==1?s:0) + (offset.x || 0)
					}
				};
			case "down": case 5: case 6: case 7:
				return {
					edge: {
						x: (d==7?'left':d==5?'right':'center') + (offset.x || 0), 
						y: 'bottom'
					},
					position: {x: 'center', y: 'top'},
					offset: {
						y: -s + (offset.y || 0),
						x: (d==7?-s:d==5?s:0) + (offset.x || 0)
					}
				};
		};
	},
	setContent: function() {
		var args = this.getArgs(arguments);
		this.pointy.setContent(args.caption, args.body);
		[this.pointy.h1, this.pointy.body].each(this.attachHandlers, this);
		if (this.visible) this.position();
		return this;
	},
	showWin: function(){
		this.parent();
		this.pointy.positionPointer();
	},
	position: function(options){
		this.parent(options);
		this.pointy.positionPointer();
	},
	attachHandlers: function(content) {
		if (!content) return;
		content.getElements('.'+this.options.closeClassName).addEvent('click', function(){ this.hide(); }.bind(this));
		content.getElements('.'+this.options.pinClassName).addEvent('click', function(){ this.togglepin(); }.bind(this));
	}
});/*
Script: Tips.Pointy.js
	Defines Tips.Pointy, An extension to Tips that adds a pointy style to the tip.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Tips.Pointy = new Class({
	Extends: Tips,
	options: {
		onShow: function(tip, stickyWin){
			stickyWin.show();
		},
		onHide: function(tip, stickyWin){
			stickyWin.hide();
		},
		pointyTipOptions: {
			point: 11,
			width: 150,
			pointyOptions: {
				closeButton: false
			}
		}
	},
	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		this.tip = new StickyWin.PointyTip($extend(this.options.pointyTipOptions, {
			showNow: false
		}));
		if (this.options.className) document.id(this.tip).addClass(this.options.className);
		if (params.elements) this.attach(params.elements);
	},
	elementEnter: function(event, element){

		var title = element.retrieve('tip:title');
		var text = element.retrieve('tip:text');
		this.tip.setContent(title, text);

		this.timer = $clear(this.timer);
		this.timer = this.show.delay(this.options.showDelay, this);

		this.position(element);
	},

	elementLeave: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this);
	},

	elementMove: function(event){
		return; //always fixed
	},

	position: function(element){
		this.tip.setOptions({
			relativeTo: element
		});
		this.tip.position();
	},

	show: function(){
		this.fireEvent('show', [document.id(this.tip), this.tip]);
	},

	hide: function(){
		this.fireEvent('hide', [document.id(this.tip), this.tip]);
	}

});