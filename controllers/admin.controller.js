
var Transaction = require('../models/transaction.model');
var Product = require('../models/product.model');

module.exports.getDashboard = (req, res)=>{
  //Thống kê trong tháng hiện tại
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


  Transaction
  .find({"create_time" : { $gte: firstDay, $lte : lastDay} })
  .then((transactions)=>{
    var sumMoneyInCurrentMonth = 0;
    var sumProductSold = 0;
    transactions.forEach((transaction)=>{
      for(let item of transaction.cart){
        sumMoneyInCurrentMonth+= item.price;
        sumProductSold+= item.qty;
      }

    });
    res.render('dashboard/dashboard',{sumMoneyInCurrentMonth, sumProductSold});
  });


}

module.exports.hotSale = (req, res)=>{
  Transaction
  .find()
  .then((transactions)=>{
    let obj = {};

    transactions.forEach((transaction)=>{
      let items = transaction.cart;

      for(let item of items){
        if(obj[item.item._id] === undefined)
          obj[item.item._id] = 1;
          else
          obj[item.item._id]++;
      }
    });

    objSort = Object.keys(obj).sort(function(a,b){return obj[b]-obj[a]})
    console.log(objSort);
    Product.find({_id:{$in: objSort}}).then((result)=>{
      result.sort(function(a, b) {
          // Sort docs by the order of their _id values in ids.
          return objSort.indexOf(a._id) - objSort.indexOf(b._id);
      });
      console.log(result)

    })

  })
  // Transaction
  // .find()
  // .select('cart')
  // .then(result=>{
  //   console.log(result)
  // })
}
