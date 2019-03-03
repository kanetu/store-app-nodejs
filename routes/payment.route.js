var express = require('express');
var router = express.Router();

var controller = require('../controllers/payment.controller');





/* GET home page. */
router.get('/', controller.index);

router.post('/checkout', controller.checkout);

router.get('/callback', controller.callback);


module.exports = router;
