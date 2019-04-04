var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');


var productSchema = new mongoose.Schema({
	name: {type:String},
	image: [{type: String}],
	price: {type: Number, default: 1000, min: 1000},
	description: String,
	supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  category_id: { type: Schema.Types.ObjectId, ref: 'Categorie' },
  classifyproduct_id: [{type: Schema.Types.ObjectId, ref: 'Classifyproduct'}],
	create_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

productSchema.index({name:'text'});

var Product = mongoose.model('Product',productSchema,'products');

module.exports = Product;
