var Vertical = {

	tags: ["hat", "cap", "hats", "caps", "faves", 'favorite'],

	initialize: function() {
		this.container = $("exhibition");
		this.container.setStyle("height", window.innerHeight);

		this.loadImages = new Array();
		this.flickr = new Request.JSONP({
			'url': "http://api.flickr.com/services/rest/",
			'data': {
				'api_key': 'c5d9b8efc69355b80e96d53ccc2fce98',
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
		var a  = new Element("a", {"href": "#", "title": photos[index].title});
		var li = new Element("li");
		this.loadImages[index].inject(a);
		a.inject(li);
		li.inject(this.container);
	},

	onPreload: function() {
		this.createExhibition();
		new Tips.Pointy(this.container.getElements("li a"), {pointyTipOptions: { point: 12, width: 150 }});
	},

	createExhibition: function() {
		var exhibition = new Exhibition.Vertical(this.container, this.container.getElements("li"));
	}
}

window.addEvent("domready", Vertical.initialize.bind(Vertical));