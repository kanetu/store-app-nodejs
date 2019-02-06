const express = require('express');
const router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './public/uploads/store' });
//controller
const controller = require('../controllers/store.controller');

//middle ware
//const middleware = require('../middlewares/category.middleware');


router.get('/', controller.index);

router.get('/create', controller.getCreateStore);

router.post('/', upload.single('imageStore'), controller.postCreateStore);

router.post('/update-form', controller.getUpdateStore);

router.post('/update',upload.single('imageStore'), controller.updateStore);

router.get('/delete/:idStore', controller.deleteStore);

module.exports = router;
