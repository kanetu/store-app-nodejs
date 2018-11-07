const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

module.exports.addItem = (req, res, next)=>{
	let productId = req.params.id;

	//var cart = new Cart(req.session.cart ? req.session.cart:{});


	Product
	.findOne({_id: productId})
	.exec()
	.then((product)=>{

		var cart = new Cart({items: {}});

		if(product.errors){
			return res.redirect('/products');
		}
		console.log(product.id);
		cart.add(product, product.id);
		console.log(cart);
	});
}