var express = require('express');
var router = express.Router();

var controller = require('../controllers/product.controller');

//middle ware
var multer = require('multer');
var upload = multer({ dest: './public/uploads/' });

router.get('/',  controller.index);

router.get('/create', controller.getCreateProduct);

router.get('/delete/:id', controller.deleteProduct);

router.post('/update-form', controller.getUpdateProduct);

router.post('/update',upload.array('imagesProduct', 10), controller.updateProduct);

router.post('/', upload.array('imagesProduct', 10), controller.postProduct);


//API

router.delete('/:id', controller.deleteProduct);


module.exports = router;
