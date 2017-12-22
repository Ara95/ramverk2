#!/usr/bin/env node
"use strict";


var express = require("express");
var app = express();
const dsn =  process.env.DBWEBB_DSN || "mongodb://0.0.0.0:27017/test";
const db = require("./src/mongodb.js").mongoDB(dsn, 'test');
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


mongoose.connect(configDB.url);

require('./config/passport.js')(passport);


app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
var port = 3000;


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
    console.log(`DBWEBB_PORT is used, port is: ${PORT}`);
} else {
    port = setport(process.env.PORT || '3000');
}



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
app.get("/crud", async (req, res) => {
    const data = await db.get();

    await db.close();
    res.render("crud", {
        title: "Crud",
        items: data
    });
});

app.post("/crud/edit", (req, res) => {
    res.render("edit", {
        title: "Crud Edit",
        item: req.body
    });
});

app.post("/insert", async (req, res) => {
    var item = {
        brand: req.body.brand,
        price: req.body.price,
        year: req.body.year
    };

    try {
        await db.insert(item);
        res.redirect('back');
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    try {
        await db.delete(req.body.id);
        res.redirect('back');
    } catch (err) {
        console.log(err);
    }
});


app.post("/update", async (req, res) => {
    var item = {
      brand: req.body.brand,
      price: req.body.price,
      year: req.body.year
    };

    try {
        await db.update(req.body.id, item);
        res.redirect('/crud');
    } catch (err) {
        console.log(err);
    }
});

console.log("Express is ready.");
console.log('Listening on port ' + PORT);
http.listen(PORT);
module.exports = express;
