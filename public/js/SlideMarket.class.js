// "use strict";
var SlideMarket = function(opt)
{
	base(this, opt);

	if ( Modernizr.interactive )
	this.parallax = new ScrollParallax({
		container: this.$container,
		layers: [
			// {selector: '.icon_bg', ratio: .40},
			// {selector: '.icon_bg2', ratio: .20},
			// {selector: '.icon_bg3', ratio: .25},
			// {selector: '.icon_bg4', ratio: .10},
			// {selector: '.icon_bg5', ratio: .30}


			{selector: '.icon_bg', ratio: .40, moveBg: true},
			{selector: '.icon_bg2', ratio: .20, moveBg: true},
			{selector: '.icon_bg3', ratio: .25, moveBg: true, offsetRight: 500},
			{selector: '.icon_bg4', ratio: .10, moveBg: true},
			{selector: '.icon_bg5', ratio: .30, moveBg: true, offsetRight: 300}
		]
	});
};
inherits(SlideMarket, Slide);
