var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	gender: String,
  birthday: Date,
	username: String,
	password: String,
	email: String,
	avatar: String,
	phone: String,
	grant: String,
  address: Object(),
  isVerify: {type: Boolean, default: false},
  create_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

userSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};
var User = mongoose.model('User',userSchema,'users');

module.exports = User;
