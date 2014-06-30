var app = {};

app.statusValues = {};

app.statusData = {
    displayed: 0,
    logged_in: false,
    allVotes: [],
    min_width: 200,
    max_width: 360,
    range_width: function(){
        return this.max_width - this.min_width;
    },

    cast_votes: 0
};

app.User = Backbone.Model.extend({});

app.Vote = Backbone.Model.extend({
    defaults: {
        city: '',
        dest: '',
//        cast_votes: '',
        width: ''
    }
});

app.Votes = Backbone.Collection.extend({
    model: app.Vote,
    url: 'http://localhost/saisai/ajax.php/votes/index'
});

app.VoteView = Backbone.View.extend({
    tagName: 'div',
    className: 'route',
    template: _.template($('#vote_meter').html()),
    initialize: function(model){
        console.log('passed model:');
        this.model = model;
        console.log(this.model);
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.data('id', this.model.get('id'));
        console.log(this.$el.html());
        console.log('id = ' + this.$el.data('id'));
        return this;
    },
    events: {
        'click .vote': 'addVote'
    },
    animateDiv: function(extend){
        extend = typeof extend !== 'undefined';
        if(extend){
            this.$el.animate({
                width: '+=' + app.statusData.div_width + 'px'
            }, 500);
        }else{
            var self = this;
            this.$el.animate({
                width: self.model.get('width')
            }, 500);
        }
    },
    addVote: function(e){
        e.preventDefault();
        /*if(!isLoggedIn()){
            var modal = new app.ModalView({modal: 'facebook'});
            return false;
        }*/
        this.addOneVote();
//        cast_votes++;
        this.showSuccess();
        this.animateDiv(true);
//        this.$el.prev().html(parseInt(this.$el.prev().html()) + 1);

        //add user id

        //validate data

        //save data to database
        this.model.save();
    },
    addOneVote: function(){
        this.model.set('votes', this.model.get('votes') + 1);
        this.model.set('width', this.model.get('width') + app.statusData.div_width);
        this.render();
    },
    showSuccess: function(){
        var modal = new app.ModalView({modal: 'beaker'});
    }
});

app.ModalView = Backbone.View.extend({
    el: '#overlay',
    initialize: function(options){
        this.options = options;
        this.modal = this.$el.find('#dialog-' + this.options.modal);
        this.render();
    },
    render: function(){
        this.$el.fadeIn();
        this.modal.fadeIn();
        return this;
    },
    events: {
        'click .ok-dialog': 'okAction',
        'click': 'overlayAction',
        'click .dialog': 'dialogAction',
        'submit form': 'createNewRoute'
    },
    hide: function() {
        this.$el.fadeOut();
        this.modal.fadeOut();
    },
    okAction: function(e){
        e.stopPropagation();
        this.hide();
        if(this.options.modal == 'facebook')
            this.fbOkAction();
    },
    overlayAction: function(){
        if (this.modal.hasClass('modal')) {
            // Do nothing
        } else {
            this.hide();
        }
    },
    dialogAction: function(e){
        e.stopPropagation();
    },
    createNewRoute: function(e){
        e.preventDefault();
        this.hide();

        var vote = {};

        var form = $(e.target).closest('form');
        vote.city = form.find('#city').val();
        vote.dest = form.find('#dest').val();
        vote.votes = 1;
        vote.width = app.statusData.min_width;

        Backbone.emulateJSON = true;
        var model = app.votes.create(vote, {wait: true});
        var modal = new app.ModalView({modal: 'beaker'});
    },
    fbOkAction: function(){
        console.log('clicked fbOk');
        facebookLogin();
    }
});

app.VotesView = Backbone.View.extend({
    el: '#votes_container',
    initialize: function(){
        var self = this;
        app.votes.fetch({
            success: function(collection, response, options){
                var arr = collection.models;
//                calculate range
                app.statusData.range_arr = range(arr);
                app.statusData.range_votes = app.statusData.range_arr[1] - app.statusData.range_arr[0];
                app.statusData.div_width = Math.floor(app.statusData.range_width() / app.statusData.range_votes);

                //set widths
                setWidths(arr, app.statusData.range_arr, app.statusData.min_width, app.statusData.div_width);

                //show meters
//                showVotes(arr);
//                self.addAll(collection);
                self.showVotes();
                app.votes.on('add', self.addOne, self);
                app.votes.on('reset', self.reset, self);
            },
            error: function(collection, response, options){
                console.log('error');
            }
        });
    },
    events: {
        'click #add_new_route' : 'showCreateRoute',
        'click #status' : 'toggleLoggedIn',
        'click #more_routes' : 'showVotes'
    },
    addOne: function(vote){
        var voteView = new app.VoteView(vote);
        this.$el.find('#container').append(voteView.render().el);

        //animate div
        voteView.animateDiv();
    },
    showVotes: function(){
//        this.$('#todo-list').html(''); // clean the todo list
        if(app.statusData.displayed < 5){
            for(;app.statusData.displayed < 5; app.statusData.displayed++){
                if(app.votes.models[app.statusData.displayed])
                    this.addOne(app.votes.models[app.statusData.displayed]);
                else
                    break;
            }
        }else{
            for(;app.votes.models[app.statusData.displayed]; app.statusData.displayed++){
                this.addOne(app.votes.models[app.statusData.displayed]);
            }
        }
//        collection.each(this.addOne, this);
    },
    addAll: function(collection){
//        this.$('#todo-list').html(''); // clean the todo list
        collection.each(this.addOne, this);
    },
    reset: function(){
        console.log('resest');
    },
    showCreateRoute: function(e){
        e.preventDefault();
        var modal = isLoggedIn() ? new app.ModalView({modal: 'star'}) : new app.ModalView({modal: 'facebook'});
    },
    toggleLoggedIn: function(e){
        e.preventDefault();
        if(isLoggedIn()){
            FB.logout(function (response) {
//                app.user = false;
                // Person is now logged out
                console.log('logout response');
                console.log(response);
                statusChangeCallback(response);
            });
        }else{
            FB.login(function (response) {
                console.log('login response');
                console.log(response);
                statusChangeCallback(response);
            }, {scope: 'public_profile,email'});
        }
    }
});

//router

app.Router = Backbone.Router.extend({
    routes: {
        "": "list"
    },
    initialize: function(){
        app.votes = new app.Votes();
        app.votesView = new app.VotesView();


        window.fbAsyncInit = function () {
            FB.init({
                appId: '254332238105062',
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.0' // use version 2.0
            });

            // Now that we've initialized the JavaScript SDK, we call
            // FB.getLoginStatus().  This function gets the state of the
            // person visiting this page and can return one of three states to
            // the callback you provide.  They can be:
            //
            // 1. Logged into your app ('connected')
            // 2. Logged into Facebook, but not your app ('not_authorized')
            // 3. Not logged into Facebook and can't tell if they are logged into
            //    your app or not.
            //
            // These three cases are handled in the callback function.

            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });

        };

        //load facebook sdk asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    },
    list: function(){
        if(app.votesView) {
            return;
        }
        app.votesView = new app.VotesView();
        console.log(app.votesView);
    }
});

app.router = new app.Router();
Backbone.history.start();

//functions

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
        //execute call back

        //create user model

    } else if (response.status === 'not_authorized') {
        app.user = false;
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log into saisai app';
    } else {
        app.user = false;
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log into Facebook';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';

        app.user = new app.User(response);
        console.log(app.user);
    });
}

function setWidths(votes, range_arr, min_width, div_width) {
    console.log('set widths');
    console.log(votes);
    console.log(range_arr);
    console.log(min_width);
    console.log(div_width);

    $.each(votes, function (index, value) {
        var ext_votes = value.get('votes') - range_arr[0];
        if (ext_votes < 0)
            ext_votes = 0;
        var ext_width = ext_votes * div_width;

        value.set('width', min_width + ext_width);
        console.log('new vote');
        console.log(value);
    });
    console.log('set widths');
}

function showVotes(votes) {
    $.each(votes, function (index, value) {
        showVote(value);
    });
}

function showVote(data) {
    console.log('showVote');
    var html = "<div class='route'><span style='min-width: 11px;max-width: 15px;display: inline-block'>" + data.votes + "</span><a href='#' class='vote'>Vote</a>city(" + data.city + ") - " + data.dest + "</div>";
    var htmlNode = $(html);
    console.log(htmlNode);

    $("#container").append(htmlNode);
    htmlNode.data('id', data.id);
    console.log('id = ' + htmlNode.data('id'));
    htmlNode.animate({
        width: data.width
    }, 500);
}

function range(arr) {
    var max = parseInt(arr[0].get('votes'));
    var min = parseInt(arr[0].get('votes'));
    console.log('max:' + max + ' min:' + min);
    $.each(arr, function (index, value) {
        value.set('votes', parseInt(value.get('votes')));
        value.set('id', parseInt(value.get('id')));

        console.log('max:' + max + ' min:' + min);
        console.log('votes: ' + value.get('votes'));
        if (value.get('votes') > max) {
            max = value.get('votes');
        }
        if (value.get('votes') < min) {
            min = value.get('votes');
        }
    });
    console.log([min, max]);
    return [min, max];
}

function isLoggedIn(){
    return app.user ? true : false;
}

function facebookLogin(){
    FB.login(function (response) {
        console.log('login response');
        console.log(response);
        statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
}

function facebookLogout(){
    FB.logout(function (response) {
        console.log('logout response');
        console.log(response);
        statusChangeCallback(response);
    });
}