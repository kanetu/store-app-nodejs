var mongoose = require('mongoose');


var categorySchema = new mongoose.Schema({
	name: String,
  parent: String,
	description: String,
	creat_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Category = mongoose.model('Category',categorySchema,'categories');

module.exports = Category;
