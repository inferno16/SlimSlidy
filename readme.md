Slim Slidy
==========

A lightweigth javascript alternative to the HTML5's input type="range" intended to be used as a audio/video player seek/volume control slider. Very poorly written since I dont write JavaScript code that often and I don't know the standarts very well. That was actually the first time I tried using functions as classes in JavaScript.

Features
--------

* Supports up to two so called tracks (the slider fillment that indicates the current value)
* Constant value change (dragging the track with the mouse)
* Not initializing the slider if there is no tracks or no main track (main track is the one that can be changed by the user if more than one main tracks are defined only the first one is recognized. The other one is automatically assigned to secondary)
* The slider have all of the important values and styles defined by default

Notes
-----

* In order to use you need to create a div with class "range_slider" with one or two child divs. At least one of the child divs should be with attribute main="1".
Here's an example:
``<div class="range_slider">``
``	<div main="1"></div>``
``</div>``
* A CSS body and html reset with height: 100% fixes problem with the dragging feature when there is not enough content on the page to fill the screen. Aside from that it's always a good thing to have the CSS resets.
* For best results apply "user-select: none;" css rules (all the prefixes) on the range_slider's parent element. This fixes poiter problem that occurs when the slider is dragged fast enough to trigger the browser's drag and drop feature.