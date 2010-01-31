var Horizontal = {

	//Your flickr API KEY
	apiKey: 'c42a22f574a978b67c468e3cfde63194',

	//Search photo tags
	tags: ["hat", "cap", "hats", "caps", "faves", 'favorite'],

	//Flickr URL
	flickrURL: "http://www.flickr.com/photos/",

	//Flickr API URL
	flickAPIURL: "http://api.flickr.com/services/rest/",

	//image caches
	cache: [],

	initialize: function() {

		$("container").setStyle("height", window.innerHeight);

		this.container = $("exhibition");
		this.preview = $("preview");
		this.container.setStyle("height", window.innerHeight);
		this.startSize = {x:0,y:0};
		this.loadImages = new Array();

		this.searchValues = new Hash({
			'api_key': this.apiKey, 'method': 'flickr.photos.search',
			'sort': 'date-posted-desc', 'tags': this.tags.join(","),
			'tag_mode': 'OR', 'per_page': 20, 'format': 'json'
		});
/*
		this.detailValues = new Hash({
			'api_key': this.apiKey, 'method': 'flickr.photos.getInfo',
			'photo_id': "", 'format': 'json'
		});
*/
		this.flickr = new Request.JSONP({
			'url': this.flickAPIURL, 'callbackKey': 'jsoncallback',
			'onSuccess': this.onSuccess.bind(this)
		});
		this.flickr.send({'data': this.searchValues});
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
		var a  = new Element("a", {"href": "#" + photo.id, "title": photo.title});
		var li = new Element("li");
		this.loadImages[index].inject(a);
		a.inject(li);
		li.inject(this.container);
	},

	onPreload: function() {
		this.exhibition = new Exhibition.Horizontal(
			this.container,
			this.container.getElements("li"), {
				"onPreload": function(elements) {
					var y1 = $("container").getSize().y;
					var y2 = this.container.getSize().y;

					this.container.setStyle("margin-top", (y1/2) - (y2/2));
				}.bind(this)
			}
		);
		$("prev").addEvent("click", this.onPrevClick.bind(this));
		$("next").addEvent("click", this.onNextClick.bind(this));

		new Tips.Pointy(this.container.getElements("li a"), {pointyTipOptions: { point: 12, width: 200 }});
	},

	onNextClick: function() { this.exhibition.next(); },
	onPrevClick: function() { this.exhibition.prev(); }
};

window.addEvent("domready", Horizontal.initialize.bind(Horizontal));