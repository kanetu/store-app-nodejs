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

function checkParentCategory(ct,parentCategory){
  for(let item of ct){
    if(item._id == parentCategory)
      return false;
    else
      if(item.sub.length > 0){
        checkParentCategory(item.sub,parentCategory);
      }
  }
  return true;
}

module.exports.checkParentCategory = (req, res, next)=>{
  let idCategory = req.body.idCategory;
  let parentCategory = req.body.parentCategory;

  Category
  .find()
  .then(function(categories){
    var t = {};
    for (var i = 0; i < categories.length; i++) {
      t[categories[i]._id] = categories[i].parent;
    }
    var structor = f(t,idCategory, categories);
    let ready = checkParentCategory(structor, parentCategory);

    console.log(ready);

    if(ready && idCategory != parentCategory)
      next();
    else
      res.json('Cant not be parent');

  });
}
