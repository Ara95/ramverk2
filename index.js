#!/usr/bin/env node
"use strict";


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

mongoose.connect(configDB.url);

require('./config/passport.js')(passport);


app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');
var port = 1337;


console.log('Listening on port ' + port);
app.set('port', port);


const path = require("path");

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');


var sessionMiddleware = session({
	secret: 'aweawesomeawesomeawesomesome',
	store: new (mongoStore(session))({
		url: configDB.url
	})
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./routes/routes.js')(app, passport);

io.use(function(socket, next){
	sessionMiddleware(socket.request, {}, next);
});

var users = [];
io.on('connection', function(socket){

	socket.on('userConnected', function(username){
		if(users.indexOf(username) < 0){
			users.push(username);
		}
		io.emit('getCurrentUsers', users);
	});

	socket.on('chat message', function(msg){



		var timestamp = new Date().toLocaleString();

		io.emit('chat message', msg.user + ": " + msg.msg + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 " + timestamp);
	});

	socket.on('image', function(img){
		io.emit('image', img);
	});
});

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

app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

console.log("Express is ready.");
http.listen(port);
module.exports = express;
