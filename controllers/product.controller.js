
const Product = require('../models/product.model');
const fs = require('fs');

module.exports.index = (req,res)=>{
	
	console.log(req.signedCookies.cart);
	
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
	
	req.body.image = '\\' + req.file.path.split('\\').slice(1).join('\\');

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
		fs.unlink('public' + data.image, (err)=>{
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

	let findProduct = Product
	.findOne({_id: req.params.id})
	.exec();

	findProduct
	.then((result)=>{
		var product;
		if(result.error) {
			res.json('Update product failed');
			return;
		}

		if( req.file ){
			req.body.image = '\\' + req.file.path.split('\\').slice(1).join('\\');
			product = {
				name: req.body.nameproduct,
				description: req.body.description,
				image: req.body.image
			}
			//Unlink image if detect new image
			fs.unlink('public' + result.image,(err) => {
				if(err){
					res.json('Delete avatar failed');
					return;
				}
			})

		}else{
			//If have not new image - use old image - not change image 
			product = {
				name: req.body.nameproduct,
				description: req.body.description,
			}

		}
		// Update execution
		Product.updateOne({_id: req.params.id}, product, (err)=>{
			if(err) res.json(err);
			else res.json('Update product successfully')
		})
	})
	
	

	

	
}	