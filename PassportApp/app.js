const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash
app.use(flash());

// Global Var
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo

mongoose.connect(db, {
        useNewUrlParser: true
    }).then(() => console.log('MongoDB Connected.....'))
    .catch(err => console.log(err));
// mongoose.connect("mongodb://localhost:27017/passport", {
//         useNewUrlParser: true
//     }).then(() => console.log('MongoDB Connected.....'))
//     .catch(err => console.log(err));

// ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log('Server has started....'));