var express = require('express');
var router = express.Router();

var userRouter = require('./user.route');
var productRouter = require('./product.route');
var cartRouter = require('./cart.route');
var categoryRouter = require('./category.route');
var storeRouter = require('./store.route');


var paymentRouter = require('./payment.route');


router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/category', categoryRouter);
router.use('/store', storeRouter);
router.use('/payment', paymentRouter);
module.exports = router;
