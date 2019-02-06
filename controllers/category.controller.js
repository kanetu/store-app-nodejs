const Category = require('../models/category.model');

function f(t, c, ct) {
    // The output structure
    var a = [];
    for( var key in t){
      if(t[key] === c){
        a.push({
            _id: key,
            name: ct.find(item=>{return item._id == key}).name,
            // The `sub` property's value is generated recursively
            sub: f(t, key, ct)
        });
      }
    }
    // Finish by returning the `a` array
    return a;
}




module.exports.index = (req, res)=>{

  Category
  .find()
  .then(function(categories){
    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    // var x = f(t,'Root', categories);
    // console.log(findCategory(f(t,'Root', categories),1));
    res.render('category/index',{data: categories, listCategory: t});
  });

}


module.exports.getCreateCategory = (req, res)=>{
  Category
  .find()
  .then(function(categories){
    var t = {};
    var temp = categories;
  	for (var i = 0; i < temp.length; i++) {
  	    t[temp[i]._id] = temp[i].parent;
  	}
    res.render('category/create',{data: f(t,'Root', categories)});
  });
}

module.exports.postCreateCategory = (req, res)=>{

  let nameCategory = req.body.nameCategory;
  let parentCategory = req.body.parentCategory;

  var category = new Category({
    name: nameCategory,
    parent: parentCategory
  });

  category
  .save()
  .then(function(result){
    res.redirect('./');
  });
}

module.exports.deleteCategory = (req, res)=>{
  let idCategory = req.params.idCategory;

  //Update all record have parent equal idCategory with parent to ROOT
  Category
  .updateMany({parent: idCategory},{parent: 'Root'},{multi: true}, function(err){
    if(err)
      res.json('Something wrong')
  });


  Category
  .deleteOne({_id: idCategory},(err)=>{
    if(err) console.log(err);
    else res.redirect('/admin/category');
  });
}

module.exports.getUpdateCategory = (req, res)=>{
	 let category =  req.body.category;

   Category
   .find()
   .then(function(categories){
     var t = {};
     var temp = categories;
   	for (var i = 0; i < temp.length; i++) {
   	    t[temp[i]._id] = temp[i].parent;
   	}
     res.render('category/update',{data: f(t,'Root', categories),category: JSON.parse(category)});
   });
}

module.exports.updateCategory = (req, res)=>{
  let idCategory = req.body.idCategory;
  let nameCategory = req.body.nameCategory;
  let parentCategory = req.body.parentCategory;


  Category
  .updateOne({_id: idCategory},{name: nameCategory,parent: parentCategory, update_time: Date.now()}, function(err){
    if(err)
      res.json('Something wrong')
    else
      res.redirect('/admin/category');
  });


}
