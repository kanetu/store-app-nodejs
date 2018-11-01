
const User = require('../models/user.model');
const fs = require('fs');


module.exports.getUser = (req, res, next) => {

	let user = User
	.find()
	.exec()
	.then((users)=>{
		res.render('user/user',{users: users})
	})
}

module.exports.postUser = (req, res, next) => {

	req.body.file = req.file.path;

	let user = new User({
		username: req.body.username,
		password: req.body.password,
		name: req.body.name,
		avatar: req.body.file,
		phone: req.body.phone,
		grant: req.body.grant
	});

	user
	.save()
	.then((result)=>{
		res.json('Create user successfully!');
	})

}

module.exports.updateUser = (req, res, next) =>{
	req.body.file = req.file.path;

	let userBefore = User
	.findOne({_id: req.params.id})
	.exec();

	let user = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		avatar: req.body.file,
		phone: req.body.phone,
		grant: req.body.grant
	}

	userBefore
	.then((data)=>{
		fs.unlink(data.avatar, (err)=>{
			if(err) res.json(err)
		})

		User.updateOne({_id:req.params.id}, user, (err) => {
			if(err) res.json(err)
				else res.json('Update user successfully')
		})
	})
	
}

module.exports.deleteUser = (req, res, next) => {

	let user = User
	.findOne({_id: req.params.id})
	.exec();

	user.then((data)=>{
		fs.unlink(data.avatar, (err)=>{
			if(err) res.json(err);
		});

		User
		.deleteOne({_id: req.params.id}, (err)=>{
			if(err) res.json(err)
				else res.json('Delete user successfully')
		})
	});
	
}