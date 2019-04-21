const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Classifyproduct = require('../models/classifyproduct.model');
const User = require('../models/user.model');

const jwt = require('jsonwebtoken');

module.exports.index = (req, res, next)=>{
	let cart = new Cart(req.signedCookies.cart);
	res.render('cart/index',{items: cart.generateArray(), totalPrice: cart.totalPrice})
}
module.exports.checkout = (req, res, next)=>{
	let cart = new Cart(req.signedCookies.cart);

  var token = req.cookies.token || null;
  // var token = req.cookies.token

  // verify a token symmetric
  if(token){
    jwt.verify(token,  process.env.SECRET_KEY_TOKEN, function(err, decoded) {
      if(!err){
        User.findOne({_id: decoded.id}).then((user)=>{
          res.render('cart/checkout',{
            user: user,
            items: cart.generateArray(),
            totalPrice: cart.totalPrice})
        })
      }else{
        //Hết hạn hoặc không có
        res.render('cart/checkout',{items: cart.generateArray(), totalPrice: cart.totalPrice})
      }
    });
  }else{
    res.render('cart/checkout',{items: cart.generateArray(), totalPrice: cart.totalPrice})
  }


}
module.exports.addItem = (req, res, next)=>{
	// let productId = req.params.id;
  var productId = req.query.idProduct;
  var classifyId = req.query.idClassify;

	//var cart = new Cart(req.session.cart ? req.session.cart:{});
	//res.cookie('cart', {items:{}}, {signed: true});

	Product
	.findOne({_id: productId})
  .lean()
	.exec()
	.then((product)=>{

		var cart = new Cart(req.signedCookies.cart? req.signedCookies.cart:{items: {}});

    Classifyproduct.findOne({_id: classifyId}).then((classify)=>{
      if(classify.quantity >= 1){
        classify.quantity--;
        Classifyproduct.updateOne({_id: classify._id}, classify, (err)=>{
          if(err) res.json(err);
        });
        cart.add(product, classify._id, classify);
        console.log(cart);
       	res.cookie('cart',cart, {signed:true});
       	res.redirect('/cart');
      }else{
        let err = "Sản phẩm đã hết hàng";
        res.redirect(`/product/detail?id=${productId}&err=${err}`);
      }
    })

	});
}



module.exports.removeOneItem = (req, res, next)=>{
	var cart = new Cart(req.signedCookies.cart);
	let itemId = req.params.id;
  Classifyproduct.findOneAndUpdate({_id :itemId}, {$inc : {'quantity' : 1}},{new:true}).exec();
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

module.exports.addItemInCart = (req, res, next)=>{
	// let productId = req.params.id;
  console.log(req.query);
  var productId = req.query.idProduct;
  var classifyId = req.query.idClassify;

	Product
	.findOne({_id: productId})
	.exec()
	.then((product)=>{

		var cart = new Cart(req.signedCookies.cart? req.signedCookies.cart:{items: {}});

    Classifyproduct.findOne({_id: classifyId}).then((classify)=>{
      if(classify.quantity >= 1){
        classify.quantity--;
        Classifyproduct.updateOne({_id: classify._id}, classify, (err)=>{
          if(err) res.json(err);
        });
        cart.add(product, classify._id, classify);
       	res.cookie('cart',cart, {signed:true});
       	res.redirect('/cart');
      }else{
        let err = "Sản phẩm đã hết hàng";
        res.redirect(`/cart?&err=${err}`);
      }
    })

	});
}



function setPriceCurrency(products){
  if(Array.isArray(products)){
    products.forEach(item=>{
      item.priceCurrency = item.price.toLocaleString('it-IT').split(',').join('.');
    })
  }else{
    products.priceCurrency = products.price.toLocaleString('it-IT').split(',').join('.');
  }


  return products;
}
