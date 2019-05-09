const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');


module.exports = function (passport) {
    passport.use(new localStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        // Match User
        User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    // null-->error
                    // false-->user
                    // this means that there shouldnt be any error and we get return of user as false i.e user dosent exist
                    return done(null, false, {
                        message: 'That email is not registered'
                    });
                }

                // Match password
                // password => password entered by the user during login
                // User.password=>hashed password in the database
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.log(err)
                    }

                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {
                            message: 'Password incorrect'
                        })
                    }
                });
            })
            .catch(err => console.log(err));
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}