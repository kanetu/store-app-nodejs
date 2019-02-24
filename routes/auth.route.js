const express = require('express');
const router = express.Router();


//Model
const User = require('../models/user.model');

//Controller
const controller = require('../controllers/auth.controller');

//middleware
const authMiddleware = require('../middlewares/auth.middleware');




router.get('/login', controller.login);

router.post('/login', controller.postLogin);

module.exports = router;

//
