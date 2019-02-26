var Product = require('../models/product.model');


module.exports.index = function(req, res, next) {
  Product
	.find()
	.then(function(products){
		res.render('index', {products: products});
	});
}
