var mongoose = require('mongoose');

var storeSchema = new mongoose.Schema({
	name: String,
	owner: String,
  partner: [],
	description: String,
  image: String,
	creat_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Store = mongoose.model('Store',storeSchema,'store');

module.exports = Store;
