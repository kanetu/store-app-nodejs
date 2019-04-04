const _ = require('lodash');

var Transaction = require('../models/transaction.model');
var Product = require('../models/product.model');
var User = require('../models/user.model');

module.exports.getDashboard = (req, res)=>{
  //Thống kê trong tháng hiện tại
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  var firstDayCurrentYear = new Date(new Date().getFullYear(), 0, 1);
  //Neu tinh theo nam thi su dung $match
  var getSt12Month = Transaction.aggregate([
    {$match: {create_time:{$gte: firstDayCurrentYear } }},
    {$unwind: "$cart"},
    {$group: {
        _id: {$toInt: {$substr: ['$create_time', 5, 2]}},
        soLuongGiaoDich: {$sum: 1},
        TongThuNhapTrongThang: {$sum: "$cart.price"}
    }},
    {$sort: {"_id":1}}
  ]).then(result=>{return result});

  var getStCurrentMonth =  Transaction.find({"create_time" : { $gte: firstDay, $lte : lastDay} }).then(result=>{return result});
  var getTotalUser = User.count({grant:'user'}).then(result => {return result});
  var get3HotSaleProduct = Transaction.find({},{'cart':1,'_id': 0}).then(result => {return result});

  Promise.all([getStCurrentMonth, getSt12Month, getTotalUser, get3HotSaleProduct])
  .then(arr=>{
    var tCurrentMonth = arr[0],
        t12Month = arr[1],
        tUser = arr[2],
        t3HotSaleProduct = arr[3];
        //**tCurrentMonth Tim tong san pham ban duoc va Tong tien
        console.log(tCurrentMonth);
        var sumMoneyInCurrentMonth = 0;
        var sumProductSold = 0;
        tCurrentMonth.forEach((transaction)=>{
          for(let item of transaction.cart){
            sumMoneyInCurrentMonth+= item.price;
            sumProductSold+= item.qty;
          }
        });

        //**t12Month Thong ke so luong ban va Tong tien 12 thang
        t12Month.forEach(item=>item._id--);
        var month = [];
        let obj = {s: 0, t: 0};

        //Mang chua 12 thang tinh tu 0
        month[0] = obj;
        month[1] = obj;
        month[2] = obj;
        month[3] = obj;
        month[4] = obj;
        month[5] = obj;
        month[6] = obj;
        month[7] = obj;
        month[8] = obj;
        month[9] = obj;
        month[10] = obj;
        month[11] = obj;

        t12Month.forEach(item=>{
          month[item._id] = {s: item.soLuongGiaoDich, t: item.TongThuNhapTrongThang};
        })

        var s = month.map((item)=>{ return item.s});
        var t = month.map((item)=>{ return item.t});


        //**t3HotSaleProduct Xử lý 3 sản phẩm bán chạy
        let all = [];
        t3HotSaleProduct.forEach(item=>{
          all= all.concat(item.cart);
        })
        // console.log(all);

        var t3HotSaleProducts = all.reduce(function(t3HotSaleProducts, product) {
                (t3HotSaleProducts[product.item._id] = t3HotSaleProducts[product.item._id] || []).push(product);
                return t3HotSaleProducts;
            }, {})
        let rank = [];

        for(let product in t3HotSaleProducts){
          //Tham chieu qua cho de xu ly
          var temp = t3HotSaleProducts[product];
          var soldOut = 0;
          //Cong so luong da ban
          temp.forEach((item)=>{
            soldOut+= item.qty;
          })
          //Gan thuoc tinh cho doi tuong de them thuoc tinh khac
          let obj = Object.assign({},temp[0].item);
          obj.soldOut = soldOut;
          rank.push(obj);
        }

        res.render('dashboard/dashboard',{
          stCurrentMonth:{sumMoneyInCurrentMonth,sumProductSold},
          st12Month:{s:s,t:t},
          tUser: tUser,
          t3HotSaleProduct: _.orderBy(rank, ['soldOut'],['desc']).splice(0,3)
        })
  })



}

module.exports.hotSale = (req, res)=>{


  Transaction
  .find({},{'cart':1,'_id': 0})
  .then(result=>{
    let all = [];
    result.forEach(item=>{
      all= all.concat(item.cart);
    })
    // console.log(all);

    var results = all.reduce(function(results, product) {
            (results[product.item._id] = results[product.item._id] || []).push(product);
            return results;
        }, {})
    let ketqua = [];
    for(let product in results){
      //Tham chieu qua cho de xu ly
      var temp = results[product];
      var soldOut = 0;
      //Cong so luong da ban
      temp.forEach((item)=>{
        soldOut+= item.qty;
      })
      //Gan thuoc tinh cho doi tuong de them thuoc tinh khac
      let obj = Object.assign({},temp[0].item);
      obj.soldOut = soldOut;
      ketqua.push(obj);
    }

    console.log(_.orderBy(ketqua, ['soldOut'],['desc']).splice(0,3));
  })
}

module.exports.staticticalYear = (req, res)=>{
  let year = req.params.year;
  var firstDayCurrentYear = new Date(year, 0, 1);
  var lastDayCurrentYear = new Date(year, 12, 0);

  Transaction.aggregate([
    {$match: {create_time:{$gte: firstDayCurrentYear, $lte: lastDayCurrentYear } }},
    {$unwind: "$cart"},
    {$group: {
        _id: {$toInt: {$substr: ['$create_time', 5, 2]}},
        soLuongGiaoDich: {$sum: 1},
        TongThuNhapTrongThang: {$sum: "$cart.price"}
    }},
    {$sort: {"_id":1}}
  ])
  .then(result=>{
    // console.log(result)
    result.forEach(item=>item._id--);
    var arr = [];
    let obj = {s: 0, t: 0};

    //Mang chua 12 thang tinh tu 0
    arr[0] = obj;
    arr[1] = obj;
    arr[2] = obj;
    arr[3] = obj;
    arr[4] = obj;
    arr[5] = obj;
    arr[6] = obj;
    arr[7] = obj;
    arr[8] = obj;
    arr[9] = obj;
    arr[10] = obj;
    arr[11] = obj;

    result.forEach(item=>{
      arr[item._id] = {s: item.soLuongGiaoDich, t: item.TongThuNhapTrongThang};
    })

    var s = arr.map((item)=>{ return item.s});
    var t = arr.map((item)=>{ return item.t});
    res.json({s,t});

  })
}

module.exports.twelveMonths = async (req, res)=>{

  var product = await Product.find({}).populate('classifyproduct_id').lean();
  product.forEach((item)=>{
    item.classifyproduct_id.forEach(c=>{
      if(c.quantity != 0){
        item.inStock = true;
        return;
      }else{
        item.inStock = false;
      }
    })
  })
  console.log(product);
}
