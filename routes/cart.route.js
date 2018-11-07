const express = require('express');
const router = express.Router();

//Controller
const controller = require('../controllers/cart.controller');




router.get('/add-to-cart/:id', controller.addItem);


module.exports = router;