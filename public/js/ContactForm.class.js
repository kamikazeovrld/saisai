//@todo for some reason this is still working well, will fix bugs later when i have time
// "use strict";
var ContactForm = function(form)
{
	base(this, form);
	this.$name = this.$form.find('input[name=name]');
	this.$contact = this.$form.find('input[name=contact]');

	this.$name.on('keyup', $.proxy(function()
	{
		this.validateInput(this.$name);
	}, this));
	this.$contact.on('keyup', $.proxy(function()
	{
		this.validateInput(this.$contact);
	}, this));
};
inherits(ContactForm, FormJsonp);

// ContactForm.SUBMIT_URL = 'http://mailing.abdoc.net/api/1c66008c3aace9847b72e873f1d2d38d';
ContactForm.prototype.onSubmit = function(e)
{
	e.preventDefault();
	console.log('submitted', this, e)
	// TODO: validation
	// TODO: send email xhr


	// this.$form.attr('action', ContactForm.SUBMIT_URL.replace('%email', this.encode(this.$contact.val())));

	// this.send(this.$name.val(), this.$contact.val());
	base(this, 'onSubmit', e);
};

ContactForm.prototype.onComplete = function(xhr, status, data)
{
	// console.log('complete', status, data);
};

ContactForm.prototype.encode = function(obj)
{
	return encodeURIComponent ? encodeURIComponent(obj) : obj;
};

ContactForm.prototype.onSend = function()
{
	var self = this;
	$('#sending').addClass('active');

	// Hide iOS keyboard
	this.$form.find('input').blur();


	setTimeout(function()
	{
		self.sent = true;
		$('#sending').removeClass('active');
		self.$form.addClass('fo');
	}, 5000);
};
ContactForm.prototype.validateInput = function(input)
{
	var $input = $(input);
	if ( $input.val().length < 1 )
	{
		$input.addClass('invalid');
		return false;
	}
	else
		$input.removeClass('invalid');
	return true;
};
ContactForm.prototype.validate = function()
{
	var valid = true;
	if ( !this.validateInput(this.$name) )
		valid = false;
	if ( !this.validateInput(this.$contact) )
		valid = false;

	if ( valid )
		this.$form.removeClass('invalid');
	else
	{
		this.$form.addClass('invalid');
		// TODO: fix timeout repeat
		var self = this;
		setTimeout(function(){
			self.$form.removeClass('invalid');
		}, 901);
	}

	return valid;
};

