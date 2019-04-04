const Category = require('../models/category.model');

const categoryHelper = require('../helpers/category.helper');





module.exports.index = (req, res)=>{

  Category
  .find()
  .then(function(categories){
    var t = {};
  	for (var i = 0; i < categories.length; i++) {
  	    t[categories[i]._id] = categories[i].parent;
  	}
    var x = categoryHelper.f(t,'Root',categories);
    // var x = f(t,'Root', categories);
    console.log(categoryHelper.f(t,'Root',categories));
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
    res.render('category/create',{data: categoryHelper.f(t,'Root', categories)});
  });
}

module.exports.postCreateCategory = (req, res)=>{

  let nameCategory = req.body.nameCategory;
  let parentCategory = req.body.parentCategory;
  let descriptionCategory = req.body.descriptionCategory;
  var category = new Category({
    name: nameCategory,
    parent: parentCategory,
    description: descriptionCategory
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
  .updateMany({parent: idCategory},{parent: 'Root'},{multi: true}, (err)=>console.log(err));


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
     res.render('category/update',{data: categoryHelper.f(t,'Root', categories),category: JSON.parse(category)});
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
