var express = require("express"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/authdemo", {
    useNewUrlParser: true
});

var app = express();
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", function (req, res) {
    res.render("secret");
});

app.listen(3000, process.env.IP, function () {
    console.log("Server Started");
});