var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	gender: String,
	username: String,
	password: String,
	email: String,
	name: String,
	avatar: String,
	phone: String,
	grant: String,
  isVerify: {type: Boolean, default: false}
});

userSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};
var User = mongoose.model('User',userSchema,'users');

module.exports = User;
