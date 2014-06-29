// "use strict";
var SlideUseCases = function(opt)
{
	base(this, opt);

	if ( Modernizr.interactive )
	this.parallax = new ScrollParallax({
		container: this.$container,
		layers: [

			{selector: '.pic1', ratio: .40, moveBg: true},
			{selector: '.pic2', ratio: .1, moveBg: true},
			{selector: '.pic3', ratio: .25, moveBg: true, offsetRight: 500},
			{selector: '.pic4', ratio: .15, moveBg: true},
			{selector: '.pic5', ratio: .15, moveBg: true},

			// {selector: '.pic1', ratio: .40},
			// {selector: '.pic2', ratio: .1},
			// {selector: '.pic3', ratio: .25},
			// {selector: '.pic4', ratio: .15},
			// {selector: '.pic5', ratio: .15},
		]
	});
};
inherits(SlideUseCases, Slide);
