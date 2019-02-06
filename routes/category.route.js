const express = require('express');
const router = express.Router();


//controller
const controller = require('../controllers/category.controller');

//middle ware
const middleware = require('../middlewares/category.middleware');


router.get('/', controller.index);

router.get('/create', controller.getCreateCategory);

router.post('/', controller.postCreateCategory);

router.get('/delete/:idCategory', controller.deleteCategory);

router.post('/update-form', controller.getUpdateCategory);

router.post('/update', middleware.checkParentCategory ,controller.updateCategory);

module.exports = router;
