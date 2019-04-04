var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var classifyproductSchema = new mongoose.Schema({
	color: String,
	size: String,
  quantity: {type: Number, default: 1, min: 0},
	create_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Classifyproduct = mongoose.model('Classifyproduct',classifyproductSchema,'classifyproducts');

module.exports = Classifyproduct;
