
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

//Helper
const dateHelper = require('../helpers/date.helper');
const stringHelper = require('../helpers/string.helper');

module.exports.index = (req, res)=>{
  Transaction.find().populate('user_id').then((transactions)=>{
    let result = transactions.map((transaction)=>{
      let totalPrice = 0;

       transaction.cart.forEach((item)=>{
         totalPrice+= item.price;
       })

      let obj = {
        _id: transaction._id,
        firstname:transaction.user_id.firstname,
        lastname:transaction.user_id.lastname,
        totalPrice: totalPrice,
        status: transaction.status,
        create_time: dateHelper.convertDate(transaction.create_time)
      }
      return obj;
    });

    res.render('transaction/index',{transactions: result});
  });

}

module.exports.viewTransaction = async (req, res)=>{
  let idTransaction = req.params.idTransaction;

  Transaction.findOne({_id: idTransaction}).populate('user_id').lean()
  .then(async (result)=>{
    let delivery = {
      city: result.deliveryCity,
      province: result.deliveryProvince,
      address: result.deliveryAddress
    }
    let customer ={
      fullName: result.customerFullName,
      phone: result.customerPhone,
      avatar: result.user_id.avatar
    }
    //
    var arr = await convertCart(result.cart);

    console.log(arr)

    res.render('transaction/view',{idTransaction,statusCurrent: result.status, items: arr, delivery, customer})
  })
  .catch((err)=>{
    res.json(err);
  })
}

async function convertCart(cart){
  let arr = []
  for(let index in cart){
    let product = await Product.findOne({_id: cart[index].item._id}).select({image: '1'}).lean();
    cart[index].item.image = product.image;
    arr.push(cart[index]);
  }

  return arr
}

module.exports.changeStatus = (req, res)=>{
  let status = req.body.status;
  let id = req.body.idTransaction;

  Transaction.findOneAndUpdate({_id: id},{status: status},{new: true}).exec()
  .then(result=>{
    if(result)
      res.redirect('/admin/transaction');
  })
}

module.exports.getInvoice = (req, res)=>{

  let idTransaction = req.params.idTransaction;
  Transaction.findOne({_id: idTransaction}).then(transaction=>{
    var cart = transaction.cart;
    var cartHTML = "";
    var totalPrice = 0;
    for(var index=0; index<cart.length; index++){
      cartHTML+= "<tr>";
      cartHTML+= `<td>${parseInt(index,10)+1}</td>`;
      cartHTML+= `<td>${cart[index].item.name}</td>`;
      cartHTML+= `<td>${cart[index].qty}</td>`;
      cartHTML+= `<td>${cart[index].classify.color + " - " + cart[index].classify.size}</td>`;
      cartHTML+= `<td>${cart[index].item.price.toLocaleString('it-IT').split(',').join('.')}đ</td>`;
      cartHTML+= `<td>${cart[index].price.toLocaleString('it-IT').split(',').join('.')}đ</td>`;
      cartHTML+= "</tr>";
      totalPrice+= cart[index].price;
    }
    res.render('transaction/invoice',{cartHTML, totalPrice, transaction, num2Word: stringHelper.num2Word.convert((totalPrice)) })
  });
}
