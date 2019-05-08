var express = require('express'),
    mongoose = require('mongoose'),
    expressLayouts = require('express-ejs-layouts');

var app = express();

// DB config
var db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {
        useNewUrlParser: true
    }).then(() => console.log('MongoDB connected....'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// ROUTES
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

var PORT = process.env.PORT || 3000;
// app.listen(PORT, console.log('Server has started'));
app.listen(PORT, process.env.IP, function () {
    console.log('Server is running....');
});