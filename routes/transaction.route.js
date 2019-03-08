var express = require('express');
var router = express.Router();


var controller = require('../controllers/transaction.controller');

router.get('/', controller.index);

router.get('/view/:idTransaction', controller.viewTransaction);

module.exports = router;
