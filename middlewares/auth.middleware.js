const User = require('../models/user.model');

module.exports.requireAuth = (req, res, next) => {
	if(!req.signedCookies.userId){
		res.redirect('/auth/login');
		return;
	}
	let findUser = User
	.findOne({_id: req.signedCookies.userId})
	.exec()
	.then((result) => {
		// if result == null it is false, return to auth/login
		//console.log(result);
		if(result.error) {
			res.redirect('/auth/login');
			return;

		}

	})
	
	User
	.findOne({_id: req.signedCookies.userId})
	.then(function(doc){
		res.locals.user = doc;
	})

	
	next();
	// If all pass execution next() to go next middleware
}