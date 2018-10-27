


var Product = require('../models/product.model');
// Product.create(products, function(err){
// 	if(err){
// 			console.log(err);
// 		}
// 	});
module.exports.index = (req,res)=>{
	
	Product.find().then(function(products){
		res.render('product/product', {products: products})	
	});
}

module.exports.getCreateProduct = (req,res)=>{
	res.render('product/create')	
}
module.exports.postProduct = (req,res)=>{
	
	req.body.image = req.file.path;
	var product = {
		name: req.body.nameproduct,
		description: req.body.description,
		image: req.body.image
	}
	Product.create(product, (err)=>{
		console.log(err);
	})
}