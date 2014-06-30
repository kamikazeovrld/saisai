/* Author: *le Zuse

    mordenizer is my bitch and she's working awesome

	Random shit
	Classes:
	Slide - one scene,
	VerticalParallaxSlide? - secene with vertical parallax (children moving),
	HorizontalParallaxSlide? - scene with mouse parallax (children moving on mouse move),
	MouseParallax - mouse handling,
	ScrollParallax - scroll handling,
	Anchor - animated scroll to anchors,
	Menu - navigation and UI, bottom bar

	this is the new shit.
*/

"use strict";

var $window = $(window),
	$document = $(document),
	$body = null;
$document.ready(function()
{
	Modernizr.addTest('ie', function(){
		return !!navigator.userAgent.match(/MSIE/i);
	});
	Modernizr.addTest('ipad', function(){
		return !!navigator.userAgent.match(/iPad/i);
	});
	Modernizr.addTest('iphone', function(){
		return !!navigator.userAgent.match(/iPhone/i);
	});
	Modernizr.addTest('ios4', function(){
    	return !!navigator.userAgent.match(/iPad.+4_[0-9]/i);
	});
	Modernizr.addTest('interactive', function(){
		return !Modernizr.ipad && !Modernizr.iphone/*&& !Modernizr.ie*/
		// .mq('@media only screen and (max-device-width: 1024px) and (orientation:landscape)');
	});
	console.log('ios4: ' +Modernizr.ios4);
});
$window.on('load', function()
{
	$body = $(document.body);

	new Menu({
		container: '#navigation'
	});
	new Footer({
		container: '#footer'
	});
	var slides = [
//		{id: 'intro', 'class': 'SlideIntro'},
//		{id: 'problem', 'class': 'SlideProblem'},
//		'solution',
		//'demo',
		{id: 'use_cases', 'class': 'SlideUseCases'},
//		'team',
		{id: 'business', 'class': 'SlideBusiness'},
		{id: 'market', 'class': 'SlideMarket'},
//		{id: 'timeline', 'class': 'SlideTimeline'},
		{id: 'contact', 'class': 'SlideContact'}
	];
	// TODO: check for anchor and slide there
	// Deactivate loader
	// setTimeout(function(){
	// 	document.body.className += ' active';
	// }, 1);
	$body.addClass('active');


	// Setup slides
	for ( var k = 0, l = slides.length; k < l; ++k )
	{
		var slide = typeof slides[k] === 'string'
			? {'class': 'Slide', id: slides[k], container: '#' + slides[k]}
			: slides[k];
		
		try
		{
			window[slide.id] = new window[slide['class']]({
				container: slide.container ? slide.container : '#' + slide.id,
				id: slide.id
			});
		}
		catch (e)
		{
			console.log('Error during slide "' + slide.id + '" setup', e);
		}
	}

	// Disable Mac OS top bounce effect
	navigator.appVersion.match(/mac/i) && $(window).bind('mousewheel', function(e){
		var x = e.originalEvent.wheelDeltaX || 0,
			y = e.originalEvent.wheelDeltaY || 0;
		var top = $(this).scrollTop();
		// console.log(y, top)
		if ( y > 0 && top <= 0 )
			e.preventDefault();
		
		// var left = $(this).scrollLeft();
		// if ( x > y && x > 0 && left <= 0 )
		// 	e.preventDefault();
	})

	// return;

	// TODO: remove
	// Disable inactive links
	$('a[href="#"], a:not([href])').click(function(e){
		e.preventDefault();
	});

	Anchor.animateLinks();

	new Scrolling({
		element: document.body
	});

	if ( !Modernizr.ipad )
	new MouseMove({
		element: document.body
	});
/*

	if ( Modernizr.interactive )
	new Challenge({
		container: '#challenge .future'
	});
*/


    $('#jabu').on('click', function(){
        alert('clicked');
    })
});
