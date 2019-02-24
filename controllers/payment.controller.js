const stripe = require('stripe')('sk_test_ToU7FF3sS1FEOXFWJzqHDo2E');



module.exports.index = (req, res) => {
  res.render('payment/index');
}


module.exports.charge = (req, res)=>{
  var token = req.body.stripeToken;
  console.log(req.body.card);
  stripe.charges.create({
    amount: 500*100,
    currency: "usd",
    source: token, // obtained with Stripe.js
    metadata: {'order_id': '6735'}
  }, function(err,charge){
    if(err) console.log(err)
    res.json('payed successfull');
  });

}
