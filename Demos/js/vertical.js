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
		this.startSize = {x:0,y:0};
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
		if (!this.cacheLarge[photoId]) {
			this.flickr = new Request.JSONP({
				'url': "http://api.flickr.com/services/rest/",
				'data': {
					'api_key': this.apiKey,
					'method': 'flickr.photos.getInfo',
					'photo_id': photoId,
					'format': 'json'
				},
				'callbackKey': 'jsoncallback',
				'onRequest': function() {
					this.preview.set("html", "Now Loading.....");
				}.bind(this),
				'onSuccess': this.onPhotoInfoSuccess.bind(this)
			});
			this.flickr.send();
		} else {
			this.render(this.cacheLarge[photoId]);
		}
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
		this.cacheLarge[props.id] = props;
		this.render(props);
	},

	render: function(props) {

		var src = "http://farm" + props.farm + ".static.flickr.com/";
		src += props.server + "/" + props.id + "_" + props.secret + "_m.jpg";

		var loadImage = new Asset.image(src, {
			"onload": function(props) {

				var attributes = loadImage.getProperties("height", "width", "src");

				var container = new Element("div", {"class": "container"});
				var title = new Element("h2", {"html": props.title});
				var image = new Element("img", {"src": attributes.src});
				var url = new Element("a", {"href": props.url, "html": props.url});
				var desc = new Element("p", {"class": "description"});

				image.inject(desc);
				if (props.description) { desc.appendText(props.description + "<br />"); }
				url.inject(desc);

				title.inject(container);
				desc.inject(container);

				this.preview.set("html", "");

				container.inject(this.preview);
				container.setStyles({"visibility": "hidden", "opacity": 0});

				
				var endSize	= container.getSize();
				var fx = this.preview.get("morph", {
					"transition": "expo:in:out",
					"onComplete": function() {
						container.setStyle("visibility", "visible");
						container.fade(0.8);
					}
				});
				fx.start({
					"margin-top": [-(this.startSize.y)/2,-endSize.y/2],
					"height": [this.startSize.y, endSize.y]
				});
				this.startSize = endSize;
			}.bind(this, [props])
		});

	}
	
};

window.addEvent("domready", Vertical.initialize.bind(Vertical));