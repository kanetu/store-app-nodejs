var express = require('express');
var router = express.Router();

//Router
var accountRouter = require('./account.route');
var productRouter = require('./product.route');
var cartRouter = require('./cart.route');
var categoryRouter = require('./category.route');
var supplierRouter = require('./supplier.route');
var transactionRouter = require('./transaction.route');

//Use for install gmail tokens
var mailHelper = require('../helpers/mail.helper')
//Controller
var controller = require('../controllers/admin.controller');

router.use('/account', accountRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/supplier', supplierRouter);
router.use('/category', categoryRouter);
router.use('/transaction', transactionRouter);

router.get('/get-new-gmail-token', mailHelper.getNewGmailToken);

router.get('/dashboard', controller.getDashboard);
router.get('/hotSale',controller.hotSale);
router.get('/twelveMonths',controller.twelveMonths);
router.get('/statictical-year/:year', controller.staticticalYear)

module.exports = router;
