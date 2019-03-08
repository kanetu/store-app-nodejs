
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');


//Helper
const dateHelper = require('../helpers/date.helper');


module.exports.index = (req, res)=>{
  Transaction.find().populate('user_id').then((transactions)=>{
    let result = transactions.map((item)=>{
      let obj = {
        _id: item._id,
        firstname:item.user_id.firstname,
        lastname:item.user_id.lastname,
        totalPrice:item.cart.totalPrice,
        create_time: dateHelper.convertDate(item.create_time)
      }
      return obj;
    });

    res.render('transaction/index',{transactions: result});
  });

}

module.exports.viewTransaction = (req, res)=>{
  let idTransaction = req.params.idTransaction;

  Transaction.findOne({_id: idTransaction}).populate('user_id')
  .then((result)=>{
    res.render('transaction/view',{items: result.cart.items})
  })
  .catch((err)=>{
    res.json(err);
  })
}
