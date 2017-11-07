#!/usr/bin/env node
"use strict";

// Create the app objekt
var express = require("express");
var app = express();

const port = normalizePort(process.env.DBWEBB_PORT || '1337');

console.log('Listening on port ' + port);



function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {

        return port;
    }

    return false;
}


const path = require("path");

// Serve static files
var staticFiles = path.join(__dirname, "public");


app.set('view engine', 'pug');


// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use(express.static(staticFiles));

// Add a saying hello
app.get("/hello", (req, res) => {
    res.send("Hello World");
});

// Route with dynamic content save in a parameter
app.get("/hello/:message", (req, res) => {
    res.send(req.params.message);
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

app.get("/test/blog", (req, res) => {
    res.render("blog", {
        title: "Blog",
        posts: [
            {
                title: "Blog post 1",
                content: "Content 1."
            },
            {
                title: "Blog post 2",
                content: "Content 2."
            },
            {
                title: "Blog post 3",
                content: "Content 3."
            },
        ]
    });
});

app.get("/test/markdown", (req, res) => {
    res.render("markdown", {
        title: "Markdown"
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
// Start up server
console.log("Express is ready.");
app.listen(port);
