var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    session = require("express-session"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

var app = express();
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/authdemo", {
    useNewUrlParser: true
});

app.use(session({
    // Secret is the keyword used to encode and decode the sessions
    // It can be bassically and keyword or sentence
    secret: "Kamehameha",
    resave: false,
    saveUninitialized: false
}));


// Tell express to use required passport package and sets it up
app.use(passport.initialize());
app.use(passport.session());

/*Responsible for reading the session,taking encoded data from the session, decoding it(deserialize) and 
 *then encoding it(serialize) and putting it back into the session
 *passportLocalMongoose in user.js adds this directly without the need for creating our own  
 */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", function (req, res) {
    res.render("secret");
});

app.listen(3000, process.env.IP, function () {
    console.log("Server Started");
});