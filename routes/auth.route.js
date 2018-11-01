const express = require('express');
const router = express.Router();

//Controller
const controller = require('../controllers/auth.controller');




router.get('/login', controller.login);

router.post('/login', controller.postLogin);

module.exports = router;