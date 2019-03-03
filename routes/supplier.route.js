const express = require('express');
const router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './public/uploads/supplier' });
//controller
const controller = require('../controllers/supplier.controller');

//middle ware
//const middleware = require('../middlewares/category.middleware');


router.get('/', controller.index);

router.get('/create', controller.getCreateSupplier);

router.post('/', upload.single('imageSupplier'), controller.postCreateSupplier);

router.post('/update-form', controller.getUpdateSupplier);

router.post('/update',upload.single('imageSupplier'), controller.updateSupplier);

router.get('/delete/:idSupplier', controller.deleteSupplier);

module.exports = router;
