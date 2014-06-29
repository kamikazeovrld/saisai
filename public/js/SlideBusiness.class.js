// "use strict";
/**
* @constructor
* @requires ScrollParallax, Slide
*/
var SlideBusiness = function(opt)
{
	base(this, opt);

	if ( Modernizr.interactive )
	this.parallax = new ScrollParallax({
		container: this.$container,
		layers: [
			{selector: '.icon_bg', ratio: .05, moveBg: true},
			{selector: '.icon_fg', ratio: .25, moveBg: true},
			{selector: '.logo_business', ratio: .4, moveBg: true},
			{selector: 'h3, h4', ratio: .35},
		]
	});
};
inherits(SlideBusiness, Slide);

if ( Modernizr.interactive )
SlideBusiness.prototype.scrollIntoView = function()
{
	this.parallax.scrollToMiddle();
};