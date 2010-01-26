var Vertical = {

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

		this.detailValues = new Hash({
			'api_key': this.apiKey, 'method': 'flickr.photos.getInfo',
			'photo_id': "", 'format': 'json'
		});

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
		if (!this.cache[photoId]) {
			this.detailValues.set("photo_id", photoId);
			
			this.flickr = new Request.JSONP({
				'url': this.flickAPIURL, 'callbackKey': 'jsoncallback',
				'onRequest': function() {
					this.preview.set("html", "Now Loading.....");
				}.bind(this),
				'onSuccess': this.onPhotoInfoSuccess.bind(this)
			});
			this.flickr.send({'data': this.detailValues});
		} else {
			this.render(this.cache[photoId]);
		}
	},

	onPhotoInfoSuccess: function(response) {
		var photo = response.photo;

		var photoTags = photo.tags.tag, tags = [];
		photoTags.each(function(h,k) {
			tags.push({
				"text": h._content,
				"url": this.flickrURL + h.author + "/" + h._content
			});
		}, this);

		var photoURLs = photo.urls.url, urls = [];
		photoURLs.each(function(h,k) {
			urls.push(h._content);
		});

		var props = {
			"id": photo.id, "farm": photo.farm, "secret": photo.secret,
			"server": photo.server, "title": photo.title._content,
			"description": photo.description._content,
			"urls": urls, "tags": tags
		};

		this.cache[props.id] = props;
		this.render(props);
	},

	render: function(props) {

		var src = "http://farm" + props.farm + ".static.flickr.com/";
		src += props.server + "/" + props.id + "_" + props.secret + "_m.jpg";

		var loadImage = new Asset.image(src, {
			"onload": function(props) {
				var attr = loadImage.getProperty("src"), urls = [], tags = [];
				props.urls.each(function(url) {
					urls.push(new Element("a", {"href": url, "html": url}));
				});

				var last = props.tags.length - 1;
 				props.tags.each(function(tag, no) {
					tags.push(new Element("a", {"href": tag.url, "html": tag.text}));
					if (no != last) tags.push(document.createTextNode(", "));
				});

				var container = new Element("div", {"class": "container"});
				var title = new Element("h2", {"html": props.title});
				var image = new Element("img", {"src": attr});
				var description = new Element("p", {"class": "description"});
				var tagLinks = new Element("p", {"class": "tags"});
	
				if (props.description) {
					description.set("html", props.description);
					new Element("br").inject(description);
					new Element("br").inject(description);
				}
				new Element("strong", {"html": "description:"}).inject(description, 'top');
				image.inject(description, 'top');

				new Element("strong", {"html": "tags:"}).inject(tagLinks);

				description.adopt(urls);
				tagLinks.adopt(tags);

				title.inject(container);
				description.inject(container);
				tagLinks.inject(container);

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