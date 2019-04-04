var Product = require('../models/product.model');
var Category = require('../models/category.model');
var Supplier = require('../models/supplier.model');
var Transaction = require('../models/transaction.model');

var _ = require('lodash');

var categoryHelper = require('../helpers/category.helper');


var date = new Date();
var firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

module.exports.index = function(req, res, next) {

  var getSupplier =  Supplier.find().then(result=>{return result});
  var getProduct = Product.find().populate('classifyproduct_id').lean().then(result=>{return result});
  var getCategory = Category.find().then(result=>{return result});
  var getTransaction = Transaction.find({},{'cart':1,'_id': 0}).then(result=>{return result});
  var getNewProduct = Product.find({'create_time':{$gte: firstDayOfThisMonth}}).lean().then(result=>{return result});

  Promise.all([getSupplier, getProduct, getCategory, getTransaction, getNewProduct])
  .then((arr)=>{
    //arr[0:supplier,1:product,2:category]
    var suppliers = arr[0],
        products  = arr[1],
        categories = arr[2],
        transactions = arr[3],
        newproducts = arr[4];

    //set in inStock
    products = setInStock(products);
    //Set price currency
    products = setPriceCurrency(products);
    newproducts = setPriceCurrency(newproducts);
    //Category feature
    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var list = categoryHelper.f(t,'Root',categories);

    //Hot sale feature
    var sixHotSell = hotSell(transactions, 6);
    sixHotSell = setPriceCurrency(sixHotSell);

    res.render('index',
    {products: setNewProduct(products),
      categories: list,
      suppliers: suppliers,
      sixHotSell: sixHotSell,
      newProduct: newproducts });

  })

}



module.exports.searchCategory  = (req, res)=>{
  let idCategory = req.query.id;

  let getProduct = Product.find({category_id: idCategory}).then(result => {return result});
  let getSupplier =  Supplier.find().then(result=>{return result});
  let getCategory = Category.find().then(result=>{return result});

  Promise.all([getSupplier, getProduct, getCategory])
  .then((arr)=>{
    //arr[0:supplier,1:product,2:category]
    var suppliers = arr[0],
        products  = arr[1],
        categories = arr[2];

    //set in inStock
    products = setInStock(products);
    //set priceCurrency

    products = setNewProduct(products);
    products = setPriceCurrency(products);

    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var list = categoryHelper.f(t,'Root',categories);

    res.render('home/search-category',{products: setNewProduct(products), categories: list, suppliers: suppliers});

  })
}

module.exports.searchSupplier = (req, res) =>{
  let idSupplier = req.query.id;
  let getProduct = Product.find({supplier_id: idSupplier}).then(result => {return result});
  let getSupplier =  Supplier.find().then(result=>{return result});
  let getCategory = Category.find().then(result=>{return result});

  Promise.all([getSupplier, getProduct, getCategory])
  .then((arr)=>{
    //arr[0:supplier,1:product,2:category]
    var suppliers = arr[0],
        products  = arr[1],
        categories = arr[2];
    //set in inStock
    products = setInStock(products);
    //set priceCurrency
    products = setPriceCurrency(products);

    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var list = categoryHelper.f(t,'Root',categories);

    res.render('home/search-supplier',{products: products, categories: list, suppliers: suppliers});

  })
}

module.exports.search = function(req, res){
  let query = req.query.name;

  let getProduct = Product.find({$text:{$search: query}}).then(result => {return result});
  let getSupplier =  Supplier.find().then(result=>{return result});
  let getCategory = Category.find().then(result=>{return result});

  Promise.all([getSupplier, getProduct, getCategory])
  .then((arr)=>{
    //arr[0:supplier,1:product,2:category]
    var suppliers = arr[0],
        products  = arr[1],
        categories = arr[2];

    //set priceCurrency
    products = setPriceCurrency(products);

    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var list = categoryHelper.f(t,'Root',categories);

    res.render('home/search',{products: products, categories: list, suppliers: suppliers});

  })


}

module.exports.viewProductDetail = (req, res)=>{
  let idProduct = req.query.id;
  var getSupplier =  Supplier.find().then(result=>{return result});
  var getProduct = Product.findOne({_id: idProduct}).populate('classifyproduct_id').then(result=>{return result});
  var getCategory = Category.find().then(result=>{return result});

  Promise.all([getSupplier, getProduct, getCategory])
  .then((arr)=>{
    //arr[0:supplier,1:product,2:category]
    var suppliers = arr[0],
        product  = arr[1],
        categories = arr[2];

    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var list = categoryHelper.f(t,'Root',categories);

    //Set priceCurrency
    product = setPriceCurrency(product);
    res.render('home/product-detail',{product: product, categories: list, suppliers: suppliers});

  })

}

function hotSell(transactions, limit){
  let all = [];
  //Concat array
  transactions.forEach(item=>{
    all = all.concat(item.cart);
  })

  var results = all.reduce(function(results, product) {
          (results[product.item._id] = results[product.item._id] || []).push(product);
          return results;
      }, {})
  let hotSells = [];
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
    hotSells.push(obj);
  }
  return _.orderBy(hotSells, ['soldOut'],['desc']).splice(0,limit);
}

function setNewProduct(products){
  //Thống kê trong tháng hiện tại
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  let maskNew = products.reduce((arr, product)=>{
    let date = new Date(product.create_time);
    if(date >= firstDay && date <= lastDay){
      product.isNew = true;
      arr.push(product);
    }else{
      product.isNew = false;
      arr.push(product);
    }
    return arr;
  },[])

  return maskNew;
}

function setPriceCurrency(products){
  if(Array.isArray(products)){
    products.forEach(item=>{
      item.priceCurrency = item.price.toLocaleString('it-IT').split(',').join('.');
    })
  }else{
    products.priceCurrency = products.price.toLocaleString('it-IT').split(',').join('.');
  }


  return products;
}

function setInStock(products){
  //products must be Array
  products.forEach((item)=>{
    item.classifyproduct_id.forEach(c=>{
      if(c.quantity != 0){
        item.inStock = true;
        return;
      }else{
        item.inStock = false;
      }
    })
  })
  return products;
}
