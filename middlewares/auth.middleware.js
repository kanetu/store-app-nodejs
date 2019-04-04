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
            else res.render('auth/verify-success')
        })
      })
      .catch(err=>{
        console.log(err)
      })
    }
  });

}


module.exports.requireAuthv1 = (req, res, next)=>{
  var token = req.cookies.token;
  // verify a token symmetric
  jwt.verify(token,  process.env.SECRET_KEY_TOKEN, function(err, decoded) {
    if(err) res.redirect('/auth/user/login');
    if(!err){
      User
    	.findOne({_id: decoded.id})
    	.then(function(user){
        if(user.isVerify){
          req.session.user = user;
          req.app.locals.user = user;
          next();
        }
        else
          res.render('auth/require-verify',{email: user.email});
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
        req.app.locals.user = user;
        if(user.grant == "admin")
          next();
        else
        res.redirect('/')
    		// res.locals.user = doc;
    	})
      .catch(err=>{
        console.log(err)
      })
    }
  });
}
