var express = require('express');
var router = express.Router();

var controller = require('../controllers/payment.controller');





/* GET home page. */
router.get('/', controller.index);

router.post('/charge', controller.charge)
module.exports = router;
