var express = require('express');
var router = express.Router();

var controller = require('../controllers/user.controller');
var middleware = require('../controllers/auth.controller');

router.get('/login', middleware.loginUser);

router.get('/',controller.index);

module.exports = router;
