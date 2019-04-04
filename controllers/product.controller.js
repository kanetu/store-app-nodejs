'use strict'
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Supplier = require('../models/supplier.model');
const Classifyproduct = require('../models/classifyproduct.model');

const fs = require('fs');
const mongoose = require('mongoose');


const categoryHelper = require('../helpers/category.helper');
//Helper
const dateHelper = require('../helpers/date.helper');

module.exports.index = (req,res)=>{

	Product
	.find()
  .populate('classifyproduct_id')
  .lean()
	.then(products => {
    products.forEach(item=>{
      item.create_time = dateHelper.convertDate(item.create_time);
      item.priceCurrency = item.price.toLocaleString('it-IT').split(',').join('.');
    })
    res.render('product/product', {products: products})
  });

}

module.exports.getCreateProduct = (req,res)=>{
  Category
  .find()
  .then(function(categories){
    var t = {};
    var temp = categories;
  	for (var i = 0; i < temp.length; i++) {
  	    t[temp[i]._id] = temp[i].parent;
  	}
    Supplier
    .find()
    .then(suppliers =>
      res.render('product/create',{suppliers: suppliers, data: categoryHelper.f(t,'Root', categories)})
    )
  });

}

module.exports.getUpdateProduct = (req, res)=>{
	 let product =  req.body.product;
   Category
   .find()
   .then(function(categories){
     var t = {};
     var temp = categories;
     for (var i = 0; i < temp.length; i++) {
       t[temp[i]._id] = temp[i].parent;
     }
     Supplier
     .find()
     .then(suppliers =>
       res.render('product/update',{suppliers: suppliers, product: JSON.parse(product), data: categoryHelper.f(t,'Root', categories)})
     )
   });
}

module.exports.deleteProduct = (req, res) =>{
	//Find item with id
	var product = Product
	.findOne({_id: req.params.id})
	.exec();

	//Remove file
	product.then((data)=>{

    data.image.forEach((link)=>{
      fs.unlink('public' + link, (err)=>{
				console.log(err);
			});
    })

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


  var images = [];
  let files = req.files;
  files.forEach((image)=>{
    let link = '\\' + image.path.split('\\').slice(1).join('\\');
    images.push(link);
    console.log(images)
  });

  var product = new Product({
    name: req.body.nameProduct,
    description: req.body.descriptionProduct,
    price: parseFloat(req.body.priceProduct),
    image: images,
    quantity: req.body.quantityProduct,
    supplier_id: req.body.idSupplier,
    category_id: req.body.idCategory
  });

  product
  .save()
  .then((result)=>{
    console.log(result);
    res.redirect('/admin/product');
  })


}


module.exports.updateProduct = (req, res)=>{


	let findProduct = Product
	.findOne({_id: req.body.idProduct})
	.exec();

	findProduct
	.then((result)=>{

		var images = [];
		var product;

		if(req.files.length > 0){

			req.files.forEach((image)=>{
				images.push('\\' + image.path.split('\\').slice(1).join('\\'));
			});
			product = {
				name: req.body.nameProduct,
				description: req.body.descriptionProduct,
				price: parseFloat(req.body.priceProduct),
				image: images,
        supplier_id: req.body.idSupplier,
        category_id: req.body.idCategory
			}
			//Unlink image if detect new images
      result.image.forEach(link=>{
        fs.unlink('public' + link, (err)=>{
          console.log(err);
        });
      })



		}else{
			//If have not new image - use old image - not change image
			product = {
				name: req.body.nameProduct,
				description: req.body.descriptionProduct,
				price: parseFloat(req.body.priceProduct),
        supplier_id: req.body.idSupplier,
        category_id: req.body.idCategory
			}

		}
		// Update execution
		Product.updateOne({_id: req.body.idProduct}, product, (err)=>{
			if(err) res.json(err);
			else res.redirect('/admin/product');
		})
	})

}

module.exports.formClassifyProduct  = (req, res)=>{
  res.render("product/classifyproduct",{idProduct: req.body.idProduct});
}
module.exports.addClassifyProduct = (req, res)=>{
  let idProduct = req.body.idProduct;

  var idCProduct = mongoose.Types.ObjectId();
  //create new classify product
  let newCProduct = new Classifyproduct({
    _id: idCProduct,
    color: req.body.color,
    size: req.body.size,
    quantity: req.body.quantity
  })

  newCProduct.save()
  //Update product with new classify product

  Product.findOneAndUpdate({_id :idProduct}, {$push:{classifyproduct_id: idCProduct}},{new:true}).exec()
  .then((result)=>{
    if(result)
      res.redirect('/admin/product');
  })


}

module.exports.getUpdateClassifyProduct = (req, res)=>{
  let classify = req.body.classify;
  res.render('product/update-classifyproduct',{classify: JSON.parse(classify)});
}

module.exports.postUpdateClassifyProduct = (req, res)=>{
  let id = req.body.id;
  let obj = {
    color: req.body.color,
    size: req.body.size,
    quantity: req.body.quantity
  }
  Classifyproduct.findOneAndUpdate({_id: id},obj,{new: true}).exec()
  .then((result)=>{
    if(result)
      res.redirect('/admin/product');
  })

}
module.exports.deleteClassifyProduct = (req, res)=>{
  let idClassify = req.params.id;

  Product.findOne({classifyproduct_id: idClassify}).then((result)=>{
    let newProduct = result;
    newProduct.classifyproduct_id.splice(newProduct.classifyproduct_id.indexOf(idClassify),1);
    // console.log(newProduct.classifyproduct_id.indexOf(id));

    Product
    .findOneAndUpdate({_id: newProduct._id},newProduct,{new: true})
    .exec()
    .then((result)=>{
      if(result)
          Classifyproduct.findOneAndDelete({_id: idClassify}).exec()
          .then(result=>{
            res.redirect('/admin/product');
          })
    })
  })
}
