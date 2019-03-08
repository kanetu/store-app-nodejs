var express = require('express');
var router = express.Router();

//Router
var accountRouter = require('./account.route');
var productRouter = require('./product.route');
var cartRouter = require('./cart.route');
var categoryRouter = require('./category.route');
var supplierRouter = require('./supplier.route');
var transactionRouter = require('./transaction.route');

//Controller
var controller = require('../controllers/admin.controller');

router.use('/account', accountRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/supplier', supplierRouter);
router.use('/category', categoryRouter);
router.use('/transaction', transactionRouter);

router.get('/dashboard', controller.getDashboard);

module.exports = router;
