const Supplier = require('../models/supplier.model');
const fs = require('fs');

//Helper
const dateHelper = require('../helpers/date.helper');

module.exports.index = (req, res)=>{


  Supplier
  .find()
  .lean()
  .then(function(suppliers){
    suppliers.forEach(item=> {
      item.create_time = dateHelper.convertDate(item.create_time);
      return item;
    })
    res.render('supplier/index',{suppliers});
  })
}

module.exports.getCreateSupplier = (req, res)=>{
  res.render('supplier/create');
}

module.exports.postCreateSupplier = (req, res)=>{

  let image = '';
  if(req.file.path){
    image = '\\' + req.file.path.split('\\').slice(1).join('\\');
  }

  var supplier = new Supplier({
    name: req.body.nameSupplier,
    description: req.body.descriptionSupplier,
    image: image
  });

  supplier
  .save()
  .then((err)=>{
    if(err)
      console.log(err)
    res.redirect('/admin/supplier');
  })

}

module.exports.getUpdateSupplier = (req, res)=>{
  res.render('supplier/update', {supplier: JSON.parse(req.body.supplier)});
}

module.exports.updateSupplier = (req, res)=>{
  let idSupplier = req.body.idSupplier;
  let newSupplier = {};
  console.log(req.body);
  if(req.file){

    //If have a new image then unlink old image
    Supplier
    .findOne({_id: idSupplier})
    .then(oldSupplier =>{
      //Unlink image if detect new image
      fs.unlink('public' + oldSupplier.image,(err) => {
        if(err){
          console.log(err);
        }
      });
    });

    let image = '\\' + req.file.path.split('\\').slice(1).join('\\');
    newSupplier = {
      name: req.body.nameSupplier,
      description: req.body.descriptionSupplier,
      image: image,
      update_time: Date.now()
    }
  }else{
    newSupplier = {
      name: req.body.nameSupplier,
      description: req.body.descriptionSupplier,
      update_time: Date.now()
    }
  }

  Supplier
  .updateOne({_id: idSupplier}, newSupplier, function(err){
    if(err)
      res.json('Something wrong');
    else
    res.redirect('/admin/supplier');
  })
}

module.exports.deleteSupplier = (req, res)=>{
  let idSupplier = req.params.idSupplier;

  Supplier
  .findOne({_id: idSupplier})
  .then(oldSupplier =>{
    //Unlink image if detect new image
    fs.unlink('public' + oldSupplier.image,(err) => {
      if(err){
        console.log(err);
      }
    });
    Supplier
    .deleteOne({_id: idSupplier},(err)=>{
      if(err) res.json('Xay ra loi');
      else res.redirect('/admin/supplier');
    });
  });


}
