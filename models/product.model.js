var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({
	name: String,
	image: {},
	price: {type: Number, default: 1},
  quantity: {type: Number, default: 1},
	description: String,
	owner_store: [{ type: Schema.Types.ObjectId, ref: 'stores' }],
  category_id: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
	creat_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Product = mongoose.model('Product',productSchema,'products');

module.exports = Product;
