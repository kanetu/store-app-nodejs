var express = require('express');
var router = express.Router();

var controller = require('../controllers/login.controller');


router.get('/', controller.index);
module.exports = router;