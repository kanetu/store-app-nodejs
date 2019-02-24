const User = require('../models/user.model');

var jwt = require('jsonwebtoken');


module.exports.confirmUser =  (req, res)=>{
  let token = req.params.token;
  jwt.verify(token,  process.env.SECRET_KEY_TOKEN, function(err, decoded) {
    if(err) res.json(err);
    if(!err){
      User
      .findOne({_id: decoded.id})
      .then(function(user){
        user.isVerify = true;
        User.updateOne({_id: decoded.id}, user, (err) => {
          if(err) res.json(err)
            else res.json('Verify user successfully')
        })
      })
      .catch(err=>{
        console.log(err)
      })
    }
  });

}

module.exports.requireAuthv2 = (req, res, next)=>{
  var token = req.cookies.token;
  // verify a token symmetric
  jwt.verify(token,  process.env.SECRET_KEY_TOKEN, function(err, decoded) {
    if(err) res.redirect('/auth/login');
    if(!err){
      User
    	.findOne({_id: decoded.id})
    	.then(function(user){
        req.session.user = user;
        next();
    		// res.locals.user = doc;
    	})
      .catch(err=>{
        console.log(err)
      })
    }
  });

}
