var express = require('express');
var router = express.Router();

var controller = require('../controllers/product.controller');

//middle ware 
var multer = require('multer');
var upload = multer({ dest: './public/uploads/' });

router.get('/',  controller.index);

router.get('/create', controller.getCreateProduct);

router.post('/', upload.single('imageproduct'), controller.postProduct);

router.put('/:id', upload.single('imageproduct'), controller.updateProduct);

router.delete('/:id', controller.deleteProduct);


module.exports = router;