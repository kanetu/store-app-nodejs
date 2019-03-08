var express = require('express');
var router = express.Router();

var controller = require('../controllers/user.controller');
// var middleware = require('../controllers/auth.controller');


router.get('/',controller.index);

router.get('/update-information', controller.getUpdateInformation);

router.post('/update-information', controller.postUpdateInformation);

router.get('/change-password', controller.getChangePassword);

router.post('/change-password', controller.postChangePassword);

router.get('/update-address', controller.getUpdateAddress);

router.post('/update-address', controller.postUpdateAddress);

router.get('/transaction', controller.getTransactionPage);

module.exports = router;
