
const Product = require('../models/product.model');
const fs = require('fs');

module.exports.index = (req,res)=>{
	
	Product
	.find()
	.then(function(products){
		res.render('product/product', {products: products})	
	});
}

module.exports.getCreateProduct = (req,res)=>{
	res.render('product/create')	
}

module.exports.postProduct = (req,res)=>{
	
	req.body.image = req.file.path;

	var product = new Product({
		name: req.body.nameproduct,
		description: req.body.description,
		image: req.body.image
	});

	product
	.save()
	.then((result)=>{
		console.log(result);
		res.json('Create product successfully');
	})
}

module.exports.deleteProduct = (req, res)=>{

	//Find item with id
	var product = Product
	.findOne({_id: req.params.id})
	.exec();

	//Remove file 
	product.then((data)=>{
		fs.unlink(data.image, (err)=>{
			console.log(err);
		});
		//Delete product with id
		Product
		.deleteOne({_id: req.params.id}, (err)=>{
			if(err){
				console.log(err);
			}
			res.json('Delete product successfully');
		})
	})
	
}


module.exports.updateProduct = (req, res)=>{
	req.body.image = req.file.path;

	let findProduct = Product
	.findOne({_id: req.params.id})
	.exec();

	if( req.body.image ){
		findProduct
		.then((result)=>{
			if(result.error) {
				res.json('Update product failed');
				return;
			}

			fs.unlink(result.avatar,(err) => {
				if(err){
					res.json('Delete avatar failed');
					return;
				}

			})
		})
	}
	var product = {
		name: req.body.nameproduct,
		description: req.body.description,
		image: req.body.image
	}

	Product.updateOne({_id: req.params.id}, product, (err)=>{
		if(err) res.json(err);
		else res.json('Update product successfully')
	})

	
}	