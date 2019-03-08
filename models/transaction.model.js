var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var transactionSchema = new mongoose.Schema({
	cart: Object(),
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: new ObjectId("5c6249cbc3604f08484859f4")},
  deliveryAddress: {type: String},
  deliveryCity: {type: String},
  deliveryProvince: {type: String},
  customerPhone: {type: String},
  customerFullName: {type: String},
	create_time: { type: Date, default: Date.now },
	update_time: { type: Date, default: Date.now }
});

// transactionSchema.methods.generateObjectID = ()=>{
//   return new ObjectId();
// }

var Transaction = mongoose.model('Transaction',transactionSchema,'transactions');


module.exports = Transaction;
