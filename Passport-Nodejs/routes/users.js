var express = require('express');
var router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render("login"));

// Register Page
router.get('/register', (req, res) => res.render("register"));

module.exports = router;