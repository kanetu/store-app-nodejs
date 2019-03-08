const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.index = (req, res)=>{
  res.render('user/index');
}
module.exports.getUpdateInformation = (req, res)=>{
  res.render('user/update-information');
}
module.exports.postUpdateInformation = (req, res)=>{
  let idUser = req.body.idUser;
  let info = {
    firstname: req.body.firstnameUser,
    lastname: req.body.lastnameUser,
    birthday: new Date(req.body.birthdayUser),
    gender: req.body.genderUser,
    phone: req.body.phoneUser
  }

  User.findOneAndUpdate({_id: idUser},info,{new: true})
  .then((result)=>{
    if(result)
      res.redirect('/user')
  })
  .catch((err)=>{
    res.json(err);
  })

}
module.exports.getChangePassword = (req, res)=>{
  res.render('user/change-password');
}
module.exports.postChangePassword = (req, res)=>{
  let idUser = req.body.idUser;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  User.findOne({_id: idUser})
  .then((user)=>{
    if(bcrypt.compareSync(oldPassword, user.password)){

      var newHashPassword = bcrypt.hashSync(newPassword, saltRounds);
      User.findOneAndUpdate({_id: idUser},{password: newHashPassword},{new:true}).exec();
      res.redirect('/user')
		}else
			res.json('Mật khẩu củ không đúng')
  })
  .catch((err)=>{
    res.json("IdUser not found");
  })


}
module.exports.getUpdateAddress = (req, res)=>{

  res.render('user/update-address');
}

module.exports.postUpdateAddress = (req, res)=>{

  let idUser = req.body.idUser;
  let address = {
    district: req.body.district,
    province: req.body.province,
    detail: req.body.detail
  }
  User.findOneAndUpdate({_id :idUser}, {address: address},{new:true})
  .then((result)=>{
    if(result){
      res.redirect('/user');
    }
  })
  .catch((err)=> res.json(err));

}

module.exports.getTransactionPage = (req, res)=>{

  let idUser = req.app.locals.user._id;
  Transaction.find({user_id: idUser})
  .then((transactions)=>{
      res.render('user/transaction',{transactions});

  })
  .catch((err)=>{
    res.json(err);
  })
}
