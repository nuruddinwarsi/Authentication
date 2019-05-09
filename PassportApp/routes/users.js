const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

// LOGIN
router.get('/login', (req, res) => res.render('login'));
// REGISTER
router.get('/register', (req, res) => res.render('register'));

// REGISTER HANDLE
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill out all fields'
        })
    }

    // Check if passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }

    // Minimum password length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be atleast 6 characters'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: 'emailID already exists in DB'
                });
                // user exists
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // HASH PASSWORD
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt,
                    (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save the user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can login');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
                    }));
            }
        })
    }
});

module.exports = router;