const User = require('../models/user.model');

const { check, validationResult  } = require('express-validator/check')

const mailHelper = require('../helpers/mail.helper');
const transporter = mailHelper.transporter;


const jwt = require('jsonwebtoken');
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

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.render('user/login',{errors: errors.array()})
  }

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

  let address = {
    district: "Chưa rõ",
    province: "Chưa rõ",
    detail: "Chưa rõ"
  }
  let user = new User({
    firstname: req.body.firstnameUser,
    lastname: req.body.lastnameUser,
    username: req.body.usernameUser,
    password: hashPassword,
    email: req.body.emailUser,
    phone: req.body.phoneUser,
    avatar: "\\img\\anonymous-user.png",
    grant: "user",
    address: address
  });

  User.count({username: req.body.usernameUser}).then((count)=>{
    if(count > 0){
      return res.render('user/login',{errRegister: "Username đã có người sử dụng"})
    }else{
      user.save()
      .then((result)=>{

        if(result){

          var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_TOKEN,{ expiresIn: '24h' });
          let mailOption = {
            form: '"Tu Minh Hieu" <sufuijk@gmail.com>',
            to: user.email,
            subject: "Confirm Email KaneStore",
            text: `Nhấn vào link sau để xác nhận tài khoản http://localhost:3000/confirm-user/${token}`
          }

          transporter.sendMail(mailOption, (err, info)=>{
            if(err) res.json(err);
          });
          res.redirect('/auth/user/login')
        }
      })
      .catch((err)=>{
        console.log(err);
      })
    }
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

module.exports.validate = (method) => {
switch (method) {
    case 'login': {
     return [
        check('username').not().isEmpty().withMessage('Username không được để trống').trim().escape(),
        check('password').not().isEmpty().withMessage('Password không được để trống').trim().escape()
       ]
    }
  }
}
