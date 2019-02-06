var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	name: String,
	image: {},
	price: Number,
	description: String,
	owner_store: String,
	creat_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Product = mongoose.model('Product',productSchema,'products');

module.exports = Product;
