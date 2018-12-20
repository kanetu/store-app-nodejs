const express = require('express');
const router = express.Router();

//Controller
const controller = require('../controllers/cart.controller');



router.get('/',controller.index);
router.get('/add-to-cart/:id', controller.addItem);
router.get('/remove-one/:id',controller.removeOneItem);
router.get('/remove-all/:id',controller.removeAllItem);


module.exports = router;