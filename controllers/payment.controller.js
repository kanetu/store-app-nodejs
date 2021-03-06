
const { OnePayDomestic } = require('vn-payments');
const { OnePayInternational } = require('vn-payments');

const Transaction = require('../models/transaction.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');

const mailHelper = require('../helpers/mail.helper');
const transporter = mailHelper.transporter;

var mongoose = require('mongoose');
const  {checkoutOnePayDomestic, callbackOnePayDomestic} = require('../helpers/onepay-handlers');



module.exports.index = (req, res) => {
  res.render('payment/index');
}


module.exports.checkout =(req, res) => {
	const userAgent = req.headers['user-agent'];
	console.log('userAgent', userAgent);

	const params = Object.assign({}, req.body);

	const clientIp =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);

	const amount = parseInt(JSON.parse(params.totalPrice), 10);//params.amount.replace(/,/g, '')
	const now = new Date();

	// NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
	const checkoutData = {
		amount,
		clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
		locale: 'vn',
		billingCity: params.billingCity || '',
		billingPostCode: params.billingPostCode || '',
		billingStateProvince: params.billingStateProvince || '',
		billingStreet: params.billingStreet || '',
		billingCountry: params.billingCountry || '',
		deliveryAddress: params.billingStreet || '',
		deliveryCity: params.billingCity || '',
		deliveryCountry: params.billingCountry || '',
		currency: 'VND',
		deliveryProvince: params.billingStateProvince || '',
		customerEmail: params.email,
		customerPhone: params.phoneNumber,
		orderId: `kt-${now.toISOString()}`,
		// returnUrl: ,
		transactionId: `kt-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
		customerId: params.email,
	};
  // need to save in transaction
  req.app.locals.checkoutData = Object.assign({}, checkoutData);
  req.app.locals.checkoutData.customerFullName = params.firstname + " " + params.lastname;
	// pass checkoutData to gateway middleware via res.locals
	res.locals.checkoutData = checkoutData;
	// Note: these handler are asynchronous
	let asyncCheckout = null;
  asyncCheckout = checkoutOnePayDomestic(req, res);


  if (asyncCheckout) {
		asyncCheckout
			.then(checkoutUrl => {
				res.writeHead(301, { Location: checkoutUrl.href });
				res.end();
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.send('Payment method not found');
	}
}

module.exports.callback = (req, res) => {
	let asyncFunc = null;
  asyncFunc = callbackOnePayDomestic(req, res);

	if (asyncFunc) {
		asyncFunc.then(() => {
      let cart = new Cart(req.signedCookies.cart);
      let totalQty = cart.totalQty;
      let totalPrice = cart.totalPrice;

      cart = cart.generateArray();



      if(res.locals.isSucceed){
        var checkoutData = req.app.locals.checkoutData;
        var transactionID = mongoose.Types.ObjectId();
        if(req.app.locals.user != null){
          let idUser = new mongoose.Types.ObjectId(res.app.locals.user._id);
          if(req.app.locals.user == null) console.log("user NULLL HERE");
          let transaction = new Transaction({
             _id: transactionID,
            cart: cart,
            user_id: idUser,
            deliveryAddress: checkoutData.deliveryAddress,
            deliveryCity: checkoutData.deliveryCity,
            deliveryProvince: checkoutData.deliveryProvince,
            customerPhone: checkoutData.customerPhone,
            customerFullName: checkoutData.customerFullName
          });
          transaction
          .save()
          .then((result)=>{
            let mailOption = {
              form: '"Tu Minh Hieu" <sufuijk@gmail.com>',
              to: checkoutData.customerEmail,
              subject: "Hoá đơn điện tử Eshopper",
              html: mailHelper.htmlInvoice(cart, checkoutData, transactionID)
            }

            transporter.sendMail(mailOption, (err, info)=>{
              if(err) res.json(err);
            });
            console.log(result);
            res.clearCookie("cart");
            res.render('payment/success',{transactionID, email: checkoutData.customerEmail, message: res.locals.message});
          })
          .catch((err)=>res.json("Error save transaction"));

        }else{
          //PHAT HIEN USER CHUA DANG NHAP, SU DUNG ID CUA ADMIN
          User.findOne({grant:"admin"}).then(admin=>{
            let idUser = admin._id;
            if(req.app.locals.user == null) console.log("user NULLL HERE");
            let transaction = new Transaction({
               _id: transactionID,
              cart: cart,
              user_id: idUser,
              deliveryAddress: checkoutData.deliveryAddress,
              deliveryCity: checkoutData.deliveryCity,
              deliveryProvince: checkoutData.deliveryProvince,
              customerPhone: checkoutData.customerPhone,
              customerFullName: checkoutData.customerFullName
            });
            transaction
            .save()
            .then((result)=>{
              let mailOption = {
                form: '"Tu Minh Hieu" <sufuijk@gmail.com>',
                to: checkoutData.customerEmail,
                subject: "Hoá đơn điện tử Eshopper",
                html: mailHelper.htmlInvoice(cart, checkoutData, transactionID)
              }

              transporter.sendMail(mailOption, (err, info)=>{
                if(err) res.json(err);
              });
              console.log(result);
              res.clearCookie("cart");
              res.render('payment/success',{transactionID, email: checkoutData.customerEmail, message: res.locals.message});
            })
            .catch((err)=>res.json("Error save transaction"));
          })

        }


      }else{
        res.render('payment/fail',{message: res.locals.message});
      }


		}).catch((err)=> res.send("Lỗi tại đây:"+err));
	} else {
		res.send('No callback found');
	}
}
