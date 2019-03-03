const express = require('express');
const router = express.Router();


//Model
const User = require('../models/user.model');

//Controller
const controller = require('../controllers/auth.controller');



router.get('/user/login', controller.loginUser);

router.get('/login', controller.login);

router.post('/login', controller.postLogin);

module.exports = router;

//
