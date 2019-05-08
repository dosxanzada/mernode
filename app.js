const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");


mongoose.connect("mongodb://localhost:27017/mernode");
let db = mongoose.connection;

db.once("open", function () {
    console.log("Connected to MongoDB");
});

db.on("error", function (err) {
    console.log(err);
});

const app = express();

let Article = require("./models/article");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true
    // cookie: {secure: true}
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


// Home Router
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                title: "SmartBilim - қашықтықтан оқытуды басқару",
                articles: articles
            });
        }
    });
});

// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);

// Start Server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});

