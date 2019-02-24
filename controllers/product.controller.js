'use strict'
const Product = require('../models/product.model');
const fs = require('fs');

module.exports.index = (req,res)=>{

	console.log(req.signedCookies.cart);

	Product
	.find()
	.then(function(products){
		res.render('product/product', {products: products});
	});
}

module.exports.getCreateProduct = (req,res)=>{
	res.render('product/create')
}

module.exports.getUpdateProduct = (req, res)=>{
	 let product =  req.body.product;
	 res.render('product/update',{product: JSON.parse(product)});
}

module.exports.deleteProduct = (req, res) =>{
	//Find item with id
	var product = Product
	.findOne({_id: req.params.id})
	.exec();

	//Remove file
	product.then((data)=>{

		for(let item in data.image){

			fs.unlink('public' + data.image[item], (err)=>{
				console.log(err);
			});
		}

		//Delete product with id
		Product
		.deleteOne({_id: req.params.id}, (err)=>{
			if(err){
				console.log(err);
			}
			res.redirect('/admin/product');

		})
	})
}



//Test create multi image
module.exports.postProduct = (req,res)=>{

	var images = {};

	const makeImageList = new Promise(function(resolve, reject){
		req.files.forEach((image)=>{
			let keyName = image.originalname.split('.')[0];
			images[keyName] = '\\' + image.path.split('\\').slice(1).join('\\');
		});
		if(images)
			resolve(images)
			else
			reject('Error when make list images');
	});

	makeImageList
	.then(function(image){
		var product = new Product({
			name: req.body.nameProduct,
			description: req.body.descriptionProduct,
			price: parseFloat(req.body.priceProduct),
			image: images,
			owner_store: req.body.ownerStore
		});

		product
		.save()
		.then((result)=>{
			console.log(result);
			res.redirect('/admin/product');
		})
	})
	.catch(function(error){
		console.log('Xảy ra lỗi');
	});



}


module.exports.updateProduct = (req, res)=>{


	let findProduct = Product
	.findOne({_id: req.body.idProduct})
	.exec();

	findProduct
	.then((result)=>{

		var images = {};
		var product;

		if(req.files.length > 0){

			req.files.forEach((image)=>{
				let keyName = image.originalname.split('.')[0];
				images[keyName] = '\\' + image.path.split('\\').slice(1).join('\\');
			});
			product = {
				name: req.body.nameProduct,
				description: req.body.descriptionProduct,
				price: parseFloat(req.body.priceProduct),
				image: images
			}
			//Unlink image if detect new images
			for(let item in result.image){
				fs.unlink('public' + result.image[item], (err)=>{
					console.log(err);
				});
			}


		}else{
			//If have not new image - use old image - not change image
			product = {
				name: req.body.nameProduct,
				description: req.body.descriptionProduct,
				price: parseFloat(req.body.priceProduct),
			}

		}
		// Update execution
		Product.updateOne({_id: req.body.idProduct}, product, (err)=>{
			if(err) res.json(err);
			else res.redirect('/admin/product');
		})
	})



}
