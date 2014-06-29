// "use strict";
var SlideContact = function(opt)
{
	base(this, opt);

	// TODO: no form?
	// TODO: check for misspellings?

	if ( !Modernizr.input.placeholder )
		new PlaceholderTextInput({
			input: this.$name
		});
};
inherits(SlideContact, Slide);

SlideContact.prototype.init = function()
{
	base(this, 'init');

	var self = this;
	this.$form = this.$container.find('form');
	this.form = new ContactForm(this.$form);
};
