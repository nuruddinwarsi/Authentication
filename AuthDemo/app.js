var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    passport = require("passport"),
    session = require("express-session"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

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
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============
// ROUTES
// =============

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Auth Routes

// CREATE---show signup form
app.get("/register", function (req, res) {
    res.render("register");
});

// Handling user signup
app.post("/register", function (req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (error, user) {
        if (error) {
            console.log(error);
            return res.redirect("register");
        }
        // "local" is the means of signing up ie local username and password
        // if it were "twitter" we would need a twitter account to signup
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");
        });
    });
});

// LOGIN ROUTES
// render login form
app.get("/login", function (req, res) {
    res.render("login");
})

// login logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login",
    }),
    function (req, res) {

    });


// LOGOUT ROUTE
app.get("/logout", function (req, res) {
    // res.send("LOGOUT");
    req.logout();
    res.redirect("/");
});

// isLoggedIn() middleware->checks if user is logged in or not
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //Allows to run the next part of the code
    }
    res.redirect("/login");
}

app.listen(3000, process.env.IP, function () {
    console.log("Server Started");
});