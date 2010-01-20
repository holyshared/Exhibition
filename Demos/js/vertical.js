var Vertical = {

	//Your flickr API KEY
	apiKey: 'c42a22f574a978b67c468e3cfde63194',

	//Search photo tags
	tags: ["hat", "cap", "hats", "caps", "faves", 'favorite'],
	
	initialize: function() {
		this.container = $("exhibition");
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
			this.container,
			this.container.getElements("li")
		);
		$("prev").addEvent("click", this.onPrevClick.bind(this));
		$("next").addEvent("click", this.onNextClick.bind(this));

		new Tips.Pointy(this.container.getElements("li a"), {pointyTipOptions: { point: 12, width: 150 }});
	},
	
	onNextClick: function() {
		this.exhibition.next();
	},

	onPrevClick: function(){
		this.exhibition.prev();
	}

	
	
	/*


		this.flickr = new Request.JSONP({
			'url': "http://api.flickr.com/services/rest/",
			'data': {
				'api_key': this.apiKey,
				'method': 'flickr.photos.getInfo',
				'photo_id': 'date-posted-desc'
				'format': 'json'
			},
			'callbackKey': 'jsoncallback',
			'onSuccess': this.onSuccess.bind(this)
		});
		this.flickr.send();

	<photo id="2733" secret="123456" server="12"
		isfavorite="0" license="3" rotation="90" 
		originalsecret="1bc09ce34a" originalformat="png">
		<owner nsid="12037949754@N01" username="Bees"
			realname="Cal Henderson" location="Bedford, UK" />
		<title>orford_castle_taster</title>
		<description>hello!</description>
		<visibility ispublic="1" isfriend="0" isfamily="0" />
		<dates posted="1100897479" taken="2004-11-19 12:51:19"
			takengranularity="0" lastupdate="1093022469" />
		<permissions permcomment="3" permaddmeta="2" />
		<editability cancomment="1" canaddmeta="1" />
		<comments>1</comments>
		<notes>
			<note id="313" author="12037949754@N01"
				authorname="Bees" x="10" y="10"
				w="50" h="50">foo</note>
		</notes>
		<tags>
			<tag id="1234" author="12037949754@N01" raw="woo yay">wooyay</tag>
			<tag id="1235" author="12037949754@N01" raw="hoopla">hoopla</tag>
		</tags>
		<urls>
			<url type="photopage">http://www.flickr.com/photos/bees/2733/</url> 
		</urls>
	</photo>
*/
	
};

window.addEvent("domready", Vertical.initialize.bind(Vertical));