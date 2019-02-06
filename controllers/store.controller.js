const Store = require('../models/store.model');
const fs = require('fs');

module.exports.index = (req, res)=>{

  Store
  .find()
  .then(function(stores){
    res.render('store/index',{stores});
  })
}

module.exports.getCreateStore = (req, res)=>{
  res.render('store/create');
}

module.exports.postCreateStore = (req, res)=>{

  let image = '';
  if(req.file.path){
    image = '\\' + req.file.path.split('\\').slice(1).join('\\');
  }

  var store = new Store({
    name: req.body.nameStore,
    owner: req.body.ownerStore,
    description: req.body.descriptionStore,
    image: image
  });

  store
  .save()
  .then((err)=>{
    if(err)
      console.log(err)
    res.redirect('/admin/store');
  })

}

module.exports.getUpdateStore = (req, res)=>{
  res.render('store/update', {store: JSON.parse(req.body.store)});
}

module.exports.updateStore = (req, res)=>{
  let idStore = req.body.idStore;
  let newStore = {};
  console.log(req.body);
  if(req.file){

    //If have a new image then unlink old image
    Store
    .findOne({_id: idStore})
    .then(oldStore =>{
      //Unlink image if detect new image
      fs.unlink('public' + oldStore.image,(err) => {
        if(err){
          console.log(err);
        }
      });
    });

    let image = '\\' + req.file.path.split('\\').slice(1).join('\\');
    newStore = {
      name: req.body.nameStore,
      ownner: req.body.ownerStore,
      description: req.body.descriptionStore,
      image: image,
      update_time: Date.now()
    }
  }else{
    newStore = {
      name: req.body.nameStore,
      ownner: req.body.ownerStore,
      description: req.body.descriptionStore,
      update_time: Date.now()
    }
  }

  Store
  .updateOne({_id: idStore}, newStore, function(err){
    if(err)
      res.json('Something wrong');
    else
    res.redirect('/admin/store');
  })
}

module.exports.deleteStore = (req, res)=>{
  let idStore = req.params.idStore;

  Store
  .findOne({_id: idStore})
  .then(oldStore =>{
    //Unlink image if detect new image
    fs.unlink('public' + oldStore.image,(err) => {
      if(err){
        console.log(err);
      }
    });
    Store
    .deleteOne({_id: idStore},(err)=>{
      if(err) res.json('Xay ra loi');
      else res.redirect('/admin/store');
    });
  });


}
