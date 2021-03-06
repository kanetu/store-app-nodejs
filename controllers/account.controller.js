
const User = require('../models/user.model');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const transporter = require('../helpers/mail.helper').transporter;




module.exports.getUser = (req, res, next) => {

  console.log(req.session);
	let user = User
	.find()
	.exec()
	.then((users)=>{
		res.render('account/account',{users: users})
	})
}

module.exports.getCreateUser = (req, res, next) => {

	res.render('account/create');
}

module.exports.postUser = (req, res, next) => {

	req.body.file = '\\' + req.file.path.split('\\').slice(1).join('\\');

  var hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
  let address = {
    district: "Chưa rõ",
    province: "Chưa rõ",
    detail: "Chưa rõ"
  }
	let user = new User({
		username: req.body.username,
		password: hashPassword,
		lastname: req.body.lastnameUser,
		firstname: req.body.firstnameUser,
		gender: req.body.genderUser,
		email: req.body.emailUser,
		avatar: req.body.file,
		phone: req.body.phoneUser,
		grant: req.body.grantUser,
    address: address
	});

	user
	.save()
	.then((result)=>{

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
		res.redirect('/admin/account');
	})

}

module.exports.getUpdateUser = (req, res)=>{
	res.render('account/update', {user: JSON.parse(req.body.user)});
}

module.exports.updateUser = (req, res, next) =>{

	let idUser = req.body.idUser;

	/*Set information*/
	let	emailUser = req.body.emailUser,
	phoneUser = req.body.phoneUser,
	grantUser = req.body.grantUser,
  genderUser = req.body.genderUser,
  firstnameUser = req.body.firstnameUser,
  lastnameUser = req.body.lastnameUser
	/*End set information*/
	let userBefore = User
	.findOne({_id: idUser})
	.exec();

	userBefore
	.then((data)=>{
		var user;
		if(req.file){

			let avatarUser = '\\' + req.file.path.split('\\').slice(1).join('\\');

			//Delete old image if we have new one
			fs.unlink('public' + data.avatar, (err)=>{
				if(err) res.json(err)
			});

			user = {
				email: emailUser,
				avatar: avatarUser,
				phone: phoneUser,
				grant: grantUser,
        gender: genderUser,
        firstname: firstnameUser,
        lastname: lastnameUser
			}
		}else{

			user = {
				email: emailUser,
				phone: phoneUser,
				grant: grantUser,
        gender: genderUser,
        firstname: firstnameUser,
        lastname: lastnameUser
			}
		}

		User.updateOne({_id: idUser}, user, (err) => {
			if(err) res.json(err)
				else res.redirect('/admin/account')
		})
	})
}

module.exports.deleteUser = (req, res, next) => {

	let user = User
	.findOne({_id: req.params.id})
	.exec();

	user.then((data)=>{
		fs.unlink('public' + data.avatar, (err)=>{
			if(err) res.json(err);
		});

		User
		.deleteOne({_id: req.params.id}, (err)=>{
			if(err) res.json(err)
				else res.redirect('admin/account')
		})
	});

}
