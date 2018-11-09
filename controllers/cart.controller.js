const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

module.exports.addItem = (req, res, next)=>{
	let productId = req.params.id;

	//var cart = new Cart(req.session.cart ? req.session.cart:{});
	//res.cookie('cart', {items:{}}, {signed: true});

	Product
	.findOne({_id: productId})
	.exec()
	.then((product)=>{

		var cart = new Cart(req.signedCookies.cart? req.signedCookies.cart:{items: {}});
		if(product.errors){
			return res.redirect('/products');
		}
		cart.add(product, product.id);
		res.cookie('cart',cart, {signed:true});

		res.redirect('/products');
	});
	
	
}