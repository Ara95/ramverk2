#!/usr/bin/env node
"use strict";

// Create the app objekt
var express = require("express");
var app = express();
var http = 				require('http').Server(app);
var io = 				require('socket.io')(http);

var mongoose = 			require('mongoose');
var passport = 			require('passport');
var flash = 			require('connect-flash');

var cookieParser = 		require('cookie-parser');
var bodyParser = 		require('body-parser');
var session = 			require('express-session');
var assert =		    require('assert');
var mongoStore = 		require("connect-mongo");

// './' is current directory
var configDB = require('./config/database.js');


function setport(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

if ('DBWEBB_PORT' in process.env) {
    port = process.env.DBWEBB_PORT;
    console.log(`DBWEBB_PORT is used, port is: ${port}`);
} else {
    port = setport(process.env.PORT || '1337');
}
// need to connect the database with the server!
mongoose.connect(configDB.url);
// link up passport as well
require('./config/passport.js')(passport);

// set up the stuff needed for logins/registering users/authentication
app.use(cookieParser()); 		// read cookies, since that is needed for authentication
app.use(bodyParser()); 			// this gets information from html forms
app.set('view engine', 'ejs');	// set view engine to ejs - templates are definitely worth it for this kind of project.
var port = 1337;


console.log('Listening on port ' + port);
app.set('port', port);


const path = require("path");

app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');


var sessionMiddleware = session({
	secret: 'aweawesomeawesomeawesomesome',
	store: new (mongoStore(session))({
		url: configDB.url
	})
});

app.use(sessionMiddleware);			// use the sessionMiddlware variable for cookies
app.use(passport.initialize());	   	// start up passport
app.use(passport.session());	    // persistent login session (what does that mean?)
app.use(flash()); 		            // connect-flash is used for flash messages stored in session.

// pass app and passport to the routes
require('./routes/routes.js')(app, passport);

// this stuff is for handling the chat functionality of the application.

// connect the sessionMiddleware with socket.io so we can get user session info
io.use(function(socket, next){
	sessionMiddleware(socket.request, {}, next);
});

// array to store all currently logged in users
var users = [];
io.on('connection', function(socket){

	// see if can get logged-in user info
	// didn't get what I thought I would get. are usernames stored with sessions?
	// console.log(socket.request.session.passport);
	socket.on('userConnected', function(username){
		if(users.indexOf(username) < 0){
			users.push(username);
		}
		io.emit('getCurrentUsers', users);
	});

	socket.on('chat message', function(msg){
		// this is the server sending out the message to every client

		// get current date and time
		var timestamp = new Date().toLocaleString();

		// adding whitespace doesn't work because this message will be surrounded by <li> tags
		// instead, you can use '\u00A0', the unicode for whitespace
		// https://stackoverflow.com/questions/12882885/how-to-add-nbsp-using-d3-js-selection-text-method
		io.emit('chat message', msg.user + ": " + msg.msg + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 " + timestamp);
	});

	socket.on('image', function(img){
		// send all clients the imgData that was sent here (to this server)
		io.emit('image', img);
	});
});
// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});


app.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
        message: "Home page!"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        message: "About me!"
    });
});

app.get("/report", (req, res) => {
    res.render("report", {
        title: "Redovisningar",
        message: "Redovisningar!"
    });
});

app.get("/app", (req, res) => {
    res.render("App", {
        title: "Applikation",
        message: "Min app!"
    });
});


// Note the error handler takes four arguments
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    err.status = err.status || 500;
    res.status(err.status);
    res.render("error", {
        error: err
    });
});


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});
// Start up server'
console.log("Express is ready.");
http.listen(port);
module.exports = express;
