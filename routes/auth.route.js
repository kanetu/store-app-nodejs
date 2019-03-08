const express = require('express');
const router = express.Router();


//Model
const User = require('../models/user.model');

//Controller
const controller = require('../controllers/auth.controller');



router.get('/user/login', controller.getUserLoginPage);

router.post('/user/login', controller.postUserLoginPage);

router.get('/user/register', controller.getUserRegisterPage);

router.post('/user/register', controller.postUserRegisterPage);

router.get('/login', controller.login);

router.post('/login', controller.postLogin);

router.get('/logout', controller.logout);

module.exports = router;

//
