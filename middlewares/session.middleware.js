module.exports.initCart = (req, res, next)=>{

	if(!req.signedCookies.cart){
		res.cookie('cart', {items:{}}, {signed: true});
	}else{
		res.locals.cartQty = req.signedCookies.cart.totalQty;
	}
	next();
}