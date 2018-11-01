var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	name: String,
	avatar: String,
	phone: String,
	grant: Number
});

var User = mongoose.model('User',userSchema,'users');

module.exports = User;
