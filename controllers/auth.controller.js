const User = require('../models/user.model');

var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.logout = (req, res)=>{
  res.clearCookie("token");
  res.app.locals.user = null;
  res.redirect('/');
}
module.exports.login = (req, res) => {
	res.render('auth/login',{title:'Login'});
}

module.exports.getUserLoginPage = (req, res)=>{
  res.render('user/login');
}
module.exports.postUserLoginPage = (req, res) => {

	let username = req.body.username;
	let password = req.body.password;
  // var hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
	User
	.findOne({username: username})
	.exec()
	.then((result)=>{
		//if result == null with findOne() that is have an error
		//if result == [] with find() that is have an error
		//everything else is oke


		if(bcrypt.compareSync(password, result.password)){

      var token = jwt.sign({ id: result.id }, process.env.SECRET_KEY_TOKEN,{ expiresIn: '1h' });

			res.cookie('token', token);
			res.redirect('/user');

		}else
			res.redirect('/auth/user/login')
	})
  .catch((err)=>{
    console.log("Username not found");
    res.redirect('/auth/user/login')
  })
}
module.exports.getUserRegisterPage = (req, res)=>{
  res.render('user/register');
}

module.exports.postUserRegisterPage = (req, res)=>{

  var hashPassword = bcrypt.hashSync(req.body.passwordUser, saltRounds);

  let user = new User({
    firstname: req.body.firstnameUser,
    lastname: req.body.lastnameUser,
    username: req.body.usernameUser,
    password: hashPassword,
    email: req.body.emailUser,
    phone: req.body.phoneUser,
    avatar: "\\img\\anonymous-user.png",
    grant: "user"
  });
  user.save()
  .then((result)=>{
    if(result)
      res.redirect('/auth/user/login')
  })
  .catch((err)=>{
    console.log(err);
  })

}

module.exports.postLogin = (req, res) => {

	let username = req.body.username;
	let password = req.body.password;
  // var hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
	User
	.findOne({username: username})
	.exec()
	.then((result)=>{
		//if result == null with findOne() that is have an error
		//if result == [] with find() that is have an error
		//everything else is oke


		if(bcrypt.compareSync(password, result.password)){

      var token = jwt.sign({ id: result.id }, process.env.SECRET_KEY_TOKEN,{ expiresIn: '1h' });

			res.cookie('token', token);
			res.redirect('/admin/dashboard');

		}else
			res.redirect('/auth/login')
	})
  .catch((err)=>{
    console.log("Username not found");
    res.redirect('/auth/login')
  })
}
