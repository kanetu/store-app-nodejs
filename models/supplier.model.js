var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var supplierSchema = new mongoose.Schema({
	name: String,
	description: String,
  image: String,
	create_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Supplier = mongoose.model('Supplier',supplierSchema,'suppliers');

module.exports = Supplier;
