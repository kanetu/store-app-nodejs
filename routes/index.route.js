var express = require('express');
var router = express.Router();

var controller = require('../controllers/index.controller');
/* GET home page. */
router.get('/', controller.index);

router.get('/search', controller.search);

router.get('/category', controller.searchCategory);

router.get('/brand', controller.searchSupplier);

router.get('/product/detail', controller.viewProductDetail);


module.exports = router;
