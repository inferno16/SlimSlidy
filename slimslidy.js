window.SlimSlidy = (function(){
    'use strict';
    var elements;
    var sliders = [];
    var md = 0;
    var evt;
    var lastSlider;

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
    }

    RangeSlider.prototype.SetCurrent = function(trackNum, percentage, trigger = false) {
        if(percentage < 0) {
            percentage = 0;
        }
        if(percentage > 1) {
            percentage = 1;
        }
        var sliderRange = this.max - this.min;
        var offset = percentage * sliderRange;
        this.tracks[trackNum].current = this.min + offset;
        UpdateProgress(this.tracks[trackNum], percentage*100);
        if(!trigger) {
            return;
        }
        var spcevt = new CustomEvent('sliderProgressChanged', {detail: this.tracks[trackNum]});
        this.self.dispatchEvent(spcevt);
    }

    window.addEventListener('mousemove', function(e){
        evt = window.event || e;
    });

    function InitMouseUp() {
        if(document.body) {
            document.body.addEventListener('mouseup', MouseUpHandler);
        }
        else {
            document.addEventListener("DOMContentLoaded", function(event) {
                document.body.addEventListener('mouseup', MouseUpHandler);
            });
        }

        function MouseUpHandler() {
            if (md) {
                ChangeValue(lastSlider, 0);
                md = 0;
                var seekendevt = new CustomEvent('sliderSeekEnd', { detail: lastSlider.tracks[0] });
                lastSlider.self.dispatchEvent(seekendevt);
            }
        }
    }

    function CreateSliderFromElement(elem) {
        if(!IsCreated(elem)) {
            return ConstructSlider(elem);
        }
        return GetSliderFromElement(elem);
    }

    function AutoCreateSliders() {
        elements = document.getElementsByClassName('range_slider');
        if(elements.length > 0) {
            ConstructSliders();
        }
    }

    function IsCreated(elem) {
        for(var i = 0; i < sliders.length; i++) {
            if (sliders[i].self === elem) {
                return true;
            }
        }
        return false;
    }

    function ConstructSliders() 
    {
        for (var i = 0; i < elements.length; i++) {
            if(!IsCreated(elements[i])) {
                ConstructSlider(elements[i])
            }
        }
    }

    function ConstructSlider(element) {
        var childCount = element.getElementsByTagName('*').length;
        if(childCount > 0 && childCount <= 2) {
            return InitTracks(element)
        }
        return null;
    }

    function InitTracks(elem)
    {
        var tracks = elem.getElementsByTagName('*');
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
            var initial = parseInt(elem.getAttribute('initial'));
            if(Number.isInteger(min))
                slider.min = min;
            if(Number.isInteger(max))
                slider.max = max;
            if(Number.isInteger(step))
                slider.step = step;
            if(Number.isInteger(initial)) {
                slider.SetCurrent(0, initial/(slider.max-slider.min));
            }
            ApplyStyle(slider);
            sliders.push(slider);
            AddHandlers(slider);
            return slider;
        }
        return null;
    }

    function ApplyStyle(slider) {
        var element = slider.self;
        element.style.cursor = 'pointer';
        if(element.style.height === '')
            element.style.height = '5px';
        if(element.style.background === '')
            element.style.background = '#555555';
        var main = slider.tracks[0].elem;
        if(main.style.background === '')
            main.style.background = '#ff0000';
        if(main.style.height === '')
            main.style.height = '100%';
        main.style.float = 'left';
        if(slider.tracks.length > 1) {
            var second = slider.tracks[1].elem;
            if(second.style.background === '')
                second.style.background = '#9d9d9d';
            if(second.style.height === '')
                second.style.height = '100%';
            if(second.style.width === '')
                second.style.width = '0';
        }
    }

    function UpdateProgress(track, percentage) {
        track.elem.style.width = percentage+'%';
    }

    function GetSliderFromElement(elem) {
        for (let i = 0; i < sliders.length; i++) {
            if(elem === sliders[i].self) {
                return sliders[i];
            }
        }
        return null;
    }

    function ChangeValue(slider, trackNum, trigger = true) 
    {
        var mouseX = evt.clientX;
        var elemRect = slider.self.getBoundingClientRect();
        var width = elemRect.right - elemRect.left;
        var relClick = mouseX - elemRect.left;
        var percentage = relClick / width;
        slider.SetCurrent(trackNum, percentage, trigger);
    }

    function AddHandlers(slider)
    {
        slider.self.addEventListener('mousedown', function(){
            md = 1;
            lastSlider = slider;
            document.body.onmousemove = function(){
                setTimeout(function(){
                    if(md) {
                        ChangeValue(slider, 0, false);
                        var seekevt = new CustomEvent('sliderSeek', {detail: lastSlider.tracks[0]});
                        lastSlider.self.dispatchEvent(seekevt);
                    }
                },50);
            };
        });
    }

    InitMouseUp();

    return {
        GetSliderFromElement: GetSliderFromElement,
        CreateSliderFromElement: CreateSliderFromElement,
        AutoCreateSliders: AutoCreateSliders
    }
})();