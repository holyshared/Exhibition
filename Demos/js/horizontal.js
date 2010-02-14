var Horizontal = {

	//Your flickr API KEY
	apiKey: 'c42a22f574a978b67c468e3cfde63194',

	//Search photo tags
	tags: ["hat", "cap", "hats", "caps", "faves", 'favorite'],

	//Flickr URL
	flickrURL: "http://www.flickr.com/photos/",

	//Flickr API URL
	flickAPIURL: "http://api.flickr.com/services/rest/",

	perPage: 20,
	
	//image caches
	cache: [],

	initialize: function() {

		$("container").setStyle("height", window.innerHeight);

		this.container = $("exhibition");
		this.preview = $("preview");
//		this.container.setStyle("height", window.innerHeight);
		this.startSize = {x:0,y:0};
		this.loadImages = new Array();

		this.current = $("container").getElement("strong.current");
		this.max = $("container").getElement("strong.max");
		this.searchValues = new Hash({
			'api_key': this.apiKey, 'method': 'flickr.photos.search',
			'sort': 'date-posted-desc', 'tags': this.tags.join(","),
			'tag_mode': 'OR', 'per_page': this.perPage, 'format': 'json'
		});
/*
		this.detailValues = new Hash({
			'api_key': this.apiKey, 'method': 'flickr.photos.getInfo',
			'photo_id': "", 'format': 'json'
		});
*/
		this.flickr = new Request.JSONP({
			'url': this.flickAPIURL, 'callbackKey': 'jsoncallback',
			'onRequest': this.onRequest.bind(this),
			'onSuccess': this.onSuccess.bind(this)
		});
		this.flickr.send({'data': this.searchValues});
	},

	onRequest: function() {
	//	this.information = new Element("p", {"class": "loading"});
	//	this.information.inject($("container"));
	//	this.information.set("html", "now loading...");
	},

	onSuccess: function(response) {
		this.response = response;
		if (response.stat == 'ok') {
			var photos = response.photos.photo;
			var preloadImages = new Array();
			photos.each(function(photo) {
				var src = "http://farm" + photo.farm + ".static.flickr.com/";
				src += photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";

				preloadImages.push(src);
			});

			this.loadImages = new Asset.images(preloadImages, {
				onProgress: this.onLoad.bind(this),
				onComplete: this.onPreload.bind(this)
			});
		}
	},

	onLoad: function(counter,index) {
		var photos = this.response.photos.photo;
		var photo = photos[index];

		var src = "http://farm" + photo.farm + ".static.flickr.com/";
		src += photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";

/*
		var owner = photo.owner;
		var id = photo.id;
		var url = "http://www.flickr.com/photos/" + owner + "/" + id;
*/
		var a  = new Element("a", {"href": src, "title": photo.title});
		var li = new Element("li");
		this.loadImages[index].inject(a);
		a.inject(li);
		li.inject(this.container);

		var size = li.getSize();
		var styleProps = {
			"top": "50%",
			"left": "50%",
			"margin-top": -(size.y/2),
			"margin-left": -(size.x/2)
		};

		li.setStyles(styleProps);
		li.fade("out");
		this.current.set("html", counter + 1);
		this.max.set("html", index + 1);
	},

	onPreload: function() {
		var elements = this.container.getElements("li");
		elements.each(function(element,k){
			element.setStyles({"top": 0, "left": 0, "margin-top": 0, "margin-left": 0});
		});


		this.exhibition = new Exhibition.Horizontal(
			this.container, elements, {
				"onPreload": function(elements, properties) {
					var y1 = $("container").getSize().y;
					var y2 = this.container.getSize().y;
					this.container.setStyle("margin-top", (y1/2) - (y2/2));

					var duration = 800;
					for (var i = 0; l = elements.length, i < l; i++) {
						var fx = elements[i].get("morph", {"duration": duration});
						fx.start({"opacity": [0,1]});
						duration = duration + 50;
					}

				}.bind(this),
				"onActive": function(index, element) {
					this.current.set("html", index + 1);
				}.bind(this)
			}
		);
		$("prev").addEvent("click", this.onPrevClick.bind(this));
		$("next").addEvent("click", this.onNextClick.bind(this));

		new Tips.Pointy(this.container.getElements("li a"), {pointyTipOptions: { point: 6, width: 200 }});
	},

	onNextClick: function() { this.exhibition.next(); },
	onPrevClick: function() { this.exhibition.prev(); }
};

window.addEvent("domready", Horizontal.initialize.bind(Horizontal));