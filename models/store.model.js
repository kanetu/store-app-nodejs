var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var storeSchema = new mongoose.Schema({
	name: String,
  owner: [{ type: Schema.Types.ObjectId, ref: 'users' }],
	description: String,
  image: String,
	creat_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

var Store = mongoose.model('Store',storeSchema,'stores');

module.exports = Store;
