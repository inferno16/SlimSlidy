var elements;
var sliders = [];
var md = 0;
var evt;

function Track() {
	this.elem = Object();
	this.current = 0;
}

function RangeSlider() {
	this.self = Object();
	this.tracks = [];
	this.min = 0;
	this.max = 100;
	this.step = 1;
	this.setCurrent = function(trackNum, value, percentage) {
		if(value < this.min) {
			value = this.min;
			percentage = 0;
		}
		if(value > this.max) {
			value = this.max;
			percentage = 100;
		}
		this.tracks[trackNum].current = value;
		updateProgress(this.tracks[trackNum], percentage);
	};
}

window.addEventListener("mousemove", function(e){
	evt = window.event || e;
});

window.addEventListener("load", function(){
	elements = document.getElementsByClassName("range_slider");
	if(elements.length > 0) {
		constructSliders();
		if(sliders.length > 0) {
			addEventListeners();
		}
	}
	document.body.onmouseup = function(){md = 0;};
	document.body.onmou = function(){md = 0;};
});

function constructSliders() 
{
	for (var i = 0; i < elements.length; i++) {
		var childCount = elements[i].getElementsByTagName("*").length;
		if(childCount > 0 && childCount <= 2) {
			initTracks(elements[i])
		}
	}
}

function initTracks(elem)
{
	var tracks = elem.getElementsByTagName("*");
	var mainTrack = -1;
	for (var i = 0; i < tracks.length; i++) {
		if(tracks[i].getAttribute('main') === '1') {
			mainTrack = i;
		}
	}
	if(mainTrack !== -1) {
		var slider = new RangeSlider();
		slider.self = elem;
		var track1 = new Track();
		track1.elem = tracks[mainTrack];
		slider.tracks.push(track1);
		if (tracks.length === 2) {
			var track2 = new Track();
			track2.elem = tracks[1 - mainTrack];
			slider.tracks.push(track2);
		}
		var min = parseInt(elem.getAttribute('min'));
		var max = parseInt(elem.getAttribute('max'));
		var step = parseInt(elem.getAttribute('step'));
		if(Number.isInteger(min))
			slider.min = min;
		if(Number.isInteger(max))
			slider.max = max;
		if(Number.isInteger(step))
			slider.step = step;
		applyStyle(slider);
		sliders.push(slider);
	}
}

function applyStyle(slider) {
	var element = slider.self;
	element.style.cursor = 'pointer';
	if(element.style.height === '')
		element.style.height = "5px";
	if(element.style.background === '')
		element.style.background = "#555555";
	var main = slider.tracks[0].elem;
	if(main.style.background === '')
		main.style.background = "#ff0000";
	if(main.style.height === '')
		main.style.height = "100%";
	main.style.float = "left";
	if(slider.tracks.length > 1) {
		var second = slider.tracks[1].elem;
		if(second.style.background === '')
			second.style.background = "#9d9d9d";
		if(second.style.height === '')
			second.style.height = "100%";
		if(second.style.width === '')
			second.style.height = "0";
	}
}

function updateProgress(track, percentage) {
	track.elem.style.width = percentage+"%";
}

function changeValue(slider, trackNum) 
{
	var mouseX = evt.clientX;
	var elemRect = slider.self.getBoundingClientRect();
	var width = elemRect.right - elemRect.left;
	var relClick = mouseX - elemRect.left;
	var percentage = relClick / width * 100;
	var sliderRange = slider.max - slider.min;
	var offset = percentage * sliderRange / 100;
	var value = slider.min + offset; //no need for checks setCurrent does it for us
	slider.setCurrent(trackNum, value, percentage);
}

function addEventListeners()
{
	// using let since the var's scope was causing problems
	for (let i = 0; i < sliders.length; i++) {
		sliders[i].self.addEventListener("mousedown", function(){
			md = 1;
			changeValue(sliders[i], 0);
			document.body.onmousemove = function(){
				if(md)
					changeValue(sliders[i], 0);
			};
		});
	}
}