var express = require('express');
var router = express.Router();

var accountRouter = require('./account.route');
var productRouter = require('./product.route');
var cartRouter = require('./cart.route');
var categoryRouter = require('./category.route');
var supplierRouter = require('./supplier.route');
var paymentRouter = require('./payment.route');


router.use('/account', accountRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/supplier', supplierRouter);
router.use('/category', categoryRouter);
router.use('/payment', paymentRouter);

module.exports = router;
