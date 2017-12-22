
var User = require('../models/user.js');

module.exports = function(app, passport){

	app.get('/chat', function(req, res){
		res.render('login.ejs', { message: "" });
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	app.post('/login', passport.authenticate('local-login', {
		failureRedirect: '/login',
		failureFlash: true
	}), function(req, res){

		res.redirect('/mainChat/');

	});

	app.get('/register', function(req, res){
		res.render('register.ejs', { message: req.flash('registerMessage') });
	});


	app.post('/register', passport.authenticate('local-register', {
		successRedirect: '/mainChat',
		failureRedirect: '/register',
		failureFlash: true
	}));


	app.get('/mainChat', function(req, res){
		res.render('index.ejs', {
			user: req.user
		});
	});


	app.get('/logout', function(req, res){
		req.logout();
		req.session.destroy();
	});


	function isLoggedIn(req, res, next){


		if(req.isAuthenticated()){
			return next();
		}


		res.redirect('/');
	}



	app.get('/default', function(req, res){
	});

}
