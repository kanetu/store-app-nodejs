var express = require('express');
var router = express.Router();

var usersRouter = require('./users.route');
var authRouter = require('./auth.route');
var productsRouter = require('./products.route');
var cartRouter = require('./cart.route');
var categoryRouter = require('./category.route');
var storeRouter = require('./store.route');


router.use('/user', usersRouter);
router.use('/auth', authRouter);
router.use('/product', productsRouter);
router.use('/cart', cartRouter);
router.use('/category', categoryRouter);
router.use('/store', storeRouter);

module.exports = router;
