var express = require('express');
var router = express.Router();
// router is used to set Routes

// router.get('/', function (req, res) {
//     res.send('Welcome');
// });

router.get('/', (req, res) => res.render('welcome'));

module.exports = router;