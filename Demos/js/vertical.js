var Vertical = {

	//Your flickr API KEY
	apiKey: 'c42a22f574a978b67c468e3cfde63194',

	//Search photo tags
	tags: ["hat", "cap", "hats", "caps", "faves", 'favorite'],

	cacheSmall: [],
	cacheLarge: [],

	initialize: function() {
		this.container = $("exhibition");
		this.preview = $("preview");
		this.container.setStyle("height", window.innerHeight);

		this.loadImages = new Array();
		this.flickr = new Request.JSONP({
			'url': "http://api.flickr.com/services/rest/",
			'data': {
				'api_key': this.apiKey,
				'method': 'flickr.photos.search',
				'sort': 'date-posted-desc',
				'tags': this.tags.join(","),
				'tag_mode': 'OR',
				'per_page': 20,
				'format': 'json'
			},
			'callbackKey': 'jsoncallback',
			'onSuccess': this.onSuccess.bind(this)
		});
		this.flickr.send();
	},

	onSuccess: function(response) {
		this.response = response;
		if (response.stat == 'ok') {
			var photos = response.photos.photo;
			var preloadImages = new Array();
			photos.each(function(photo) {
				var src = "http://farm" + photo.farm + ".static.flickr.com/";
				src += photo.server + "/" + photo.id + "_" + photo.secret + "_t.jpg";

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
		this.exhibition = new Exhibition.Vertical(
			this.container, this.container.getElements("li"), {
				"onActive": this.onActive.bind(this)
			}
		);
		$("prev").addEvent("click", this.onPrevClick.bind(this));
		$("next").addEvent("click", this.onNextClick.bind(this));

		new Tips.Pointy(this.container.getElements("li a"), {pointyTipOptions: { point: 12, width: 150 }});
	},
	
	onNextClick: function() {
		this.exhibition.next();
	},

	onPrevClick: function() {
		this.exhibition.prev();
	},
	
	onActive: function(index, element) {
		var photoId = element.getProperty("href").replace("#", "");
		this.flickr = new Request.JSONP({
			'url': "http://api.flickr.com/services/rest/",
			'data': {
				'api_key': this.apiKey,
				'method': 'flickr.photos.getInfo',
				'photo_id': photoId,
				'format': 'json'
			},
			'callbackKey': 'jsoncallback',
			'onSuccess': this.onPhotoInfoSuccess.bind(this)
		});
		this.flickr.send();
	},

	onPhotoInfoSuccess: function(response) {
		var photo = response.photo;
		var props = {
			"id": photo.id,
			"farm": photo.farm,
			"secret": photo.secret,
			"server": photo.server,
			"title": photo.title._content,
			"description": photo.description._content,
			"url": photo.urls.url.shift()._content
		};
		this.cacheLarge[props.id].push(props);

		var src = "http://farm" + props.farm + ".static.flickr.com/";
		src += props.server + "/" + props.id + "_" + props.secret + "_m.jpg";
		
		var title = new Element("h2", {"html": props.title});
		var image = new Element("img", {"src": src})
			.inject(new Element("p", {"class": "image"}));
		var desc = new Element("a", {"href": props.url})
			.inject(new Element("p", {"class": "description", "html": props.description}));
	
		this.preview.set("html", "");
		this.preview.adopt(title,image,desc);
	}
	
};

window.addEvent("domready", Vertical.initialize.bind(Vertical));