var express = require('express');
var router = express.Router();

var controller = require('../controllers/product.controller');

//middle ware 
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/',  controller.index);
router.get('/create', controller.getCreateProduct);
router.post('/create', upload.single('imageproduct'), controller.postProduct);
module.exports = router;