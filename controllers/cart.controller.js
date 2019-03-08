const Cart = require('../models/cart.model');
const Product = require('../models/product.model');


module.exports.index = (req, res, next)=>{
	let cart = new Cart(req.signedCookies.cart);
	console.log(cart);
	res.render('cart/index',{items: cart.generateArray(), totalPrice: cart.totalPrice})
}

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
			return res.json(product.errors);
		}

    if(product.quantity >= 1){

      product.quantity--;
      Product.updateOne({_id: product.id}, product, (err)=>{
        if(err) res.json(err);
      });

      cart.add(product, product.id);
  		res.cookie('cart',cart, {signed:true});
  		res.redirect('/cart');
    }else{
      res.json('Het hang')
    }

	});
}

module.exports.removeOneItem = (req, res, next)=>{
	var cart = new Cart(req.signedCookies.cart);
	let itemId = req.params.id;
  Product.findOneAndUpdate({_id :itemId}, {$inc : {'quantity' : 1}},{new:true}).exec();
	cart.removeOneItem(itemId);
	res.cookie('cart',cart,{signed:true});
	console.log(cart);
	res.redirect('/cart');

}

module.exports.removeAllItem = (req, res, next)=>{
	var cart = new Cart(req.signedCookies.cart);
	let itemId = req.params.id;

	cart.removeAllItem(itemId);
	res.cookie('cart',cart,{signed:true});
	console.log(cart);
	res.redirect('/cart');

}
