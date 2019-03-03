const User = require('../models/user.model');

var jwt = require('jsonwebtoken');


module.exports.login = (req, res) => {
	res.render('auth/login',{title:'Login'});
}

module.exports.loginUser = (req, res)=>{
  res.render('auth/login');
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

      var token = jwt.sign({ id: result.id }, process.env.SECRET_KEY_TOKEN,{ expiresIn: '1h' });

			res.cookie('token', token);
			res.json('Authentication successfully');

		}else
			res.json('Authentication failed')
	})
}
