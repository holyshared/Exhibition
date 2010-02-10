Exhibition
===========

![Screenshot](http://holyshared.github.com/Exhibition/images/screenshot.jpg)

How to use
----------

A description necessary to use Exhibition is as follows.

HTML to use Exhibition is described in the beginning. 
HTML is as follows. 

	#HTML
<div id="container">
	<ul id="exhibition" class="exhibition">
		<li><a href="#"><img src="images/home/img_tn1.jpg" width="152" height="228" /></a></li>
		<li><a href="#"><img src="images/home/img_tn2.jpg" width="218" height="147" /></a></li>
		<li><a href="#"><img src="images/home/img_tn3.jpg" width="154" height="191" /></a></li>
		<li><a href="#"><img src="images/home/img_tn4.jpg" width="167" height="233" /></a></li>
		<li><a href="#"><img src="images/home/img_tn5.jpg" width="301" height="187" /></a></li>

		<li><a href="#"><img src="images/home/img_tn6.jpg" width="167" height="221" /></a></li>
		<li><a href="#"><img src="images/home/img_tn7.jpg" width="251" height="167" /></a></li>
		<li><a href="#"><img src="images/home/img_tn8.jpg" width="182" height="213" /></a></li>
		<li><a href="#"><img src="images/home/img_tn9.jpg" width="249" height="178" /></a></li>
		<li><a href="#"><img src="images/home/img_tn10.jpg" width="159" height="238" /></a></li>

		<li><a href="#"><img src="images/home/img_tn1.jpg" width="152" height="228" /></a></li>
		<li><a href="#"><img src="images/home/img_tn2.jpg" width="218" height="147" /></a></li>
		<li><a href="#"><img src="images/home/img_tn3.jpg" width="154" height="191" /></a></li>
		<li><a href="#"><img src="images/home/img_tn4.jpg" width="167" height="233" /></a></li>
		<li><a href="#"><img src="images/home/img_tn5.jpg" width="301" height="187" /></a></li>

		<li><a href="#"><img src="images/home/img_tn5.jpg" width="301" height="187" /></a></li>
		<li><a href="#"><img src="images/home/img_tn6.jpg" width="167" height="221" /></a></li>
		<li><a href="#"><img src="images/home/img_tn7.jpg" width="251" height="167" /></a></li>
		<li><a href="#"><img src="images/home/img_tn8.jpg" width="182" height="213" /></a></li>
		<li><a href="#"><img src="images/home/img_tn9.jpg" width="249" height="178" /></a></li>

		<li><a href="#"><img src="images/home/img_tn10.jpg" width="159" height="238" /></a></li>
		<li><a href="#"><img src="images/home/img_tn11.jpg" width="233" height="153" /></a></li>
		<li><a href="#"><img src="images/home/img_tn1.jpg" width="152" height="228" /></a></li>
		<li><a href="#"><img src="images/home/img_tn2.jpg" width="218" height="147" /></a></li>
		<li><a href="#"><img src="images/home/img_tn3.jpg" width="154" height="191" /></a></li>

		<li><a href="#"><img src="images/home/img_tn4.jpg" width="167" height="233" /></a></li>
		<li><a href="#"><img src="images/home/img_tn5.jpg" width="301" height="187" /></a></li>
		<li><a href="#"><img src="images/home/img_tn6.jpg" width="167" height="221" /></a></li>
		<li><a href="#"><img src="images/home/img_tn7.jpg" width="251" height="167" /></a></li>
		<li><a href="#"><img src="images/home/img_tn8.jpg" width="182" height="213" /></a></li>
	</ul>
</div>


	#CSS
div#container {
	overflow: hidden;
}

ul.exhibition {
	overflow: hidden;
	list-style: none;
	position: relative;
}

ul.exhibition li {
	position: absolute;
}

ul.exhibition li a {
	display: block;
	padding: 10px;
	background: #333333;
}

ul.exhibition li a:hover {
	background: #3c94af;
}

ul.exhibition li.active a {
	background: #3c94af;
}

Next, javascript is described. 
The element and the image that plays the role of the container are specified. 
The option is specified now.

	#JS
window.addEvent("domready", function() {

	var container = $("container");
	var exhibition = $("exhibition");

	container.setStyle("height", window.innerHeight);
	exhibition.setStyle("height", window.innerHeight);
	
	var images = exhibition.getElements("li");
	new Exhibition(exhibition, images, {"defaultIndex": Math.round((images.length - 1)/2)});

});

Options
-------

All options have default values assigned, hence are optional.

### Version 1.0

* **defaultIndex
* **duration
* **transition
* **blank
* **onNext: $empty
* **onPrev: $empty
* **onActive: $empty


Screenshots
-----------

![Exhibition](http://holyshared.github.com/Exhibition/images/exhibition.jpg)
![Exhibition.Horizontal](http://holyshared.github.com/Exhibition/images/exhibition-horizontal.jpg)
![Exhibition.Vertical](http://holyshared.github.com/Exhibition/images/exhibition-vertical.jpg)
