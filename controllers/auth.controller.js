const User = require('../models/user.model');


module.exports.login = (req, res) => {
	res.render('auth/login',{title:'Login'});
}


module.exports.postLogin = (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

	User
	.findOne({username: username, password: password})
	.exec()
	.then((result)=>{
		//if result == null with findOne() that is have an error
		//if result == [] with find() that is have an error
		//everything else is oke
		if(result){

			res.cookie('userId', result.id, {signed: true});
			res.cookie('userGrant', result.grant, {signed: true});
			res.json('Authentication successfully');

		}else 
			res.json('Authentication failed')
	})
}