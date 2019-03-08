var { OnePayDomestic, OnePayInternational } = require('vn-payments');
/* eslint-disable no-param-reassign */
const { Countries } = require('./countries');


const onepayDom = new OnePayDomestic({
	paymentGateway: 'https://mtf.onepay.vn/onecomm-pay/vpc.op',
	merchant: 'ONEPAY',
	accessCode: 'D67342C2',
	secureSecret: 'A3EFDFABA8653DF2342E8DAC29B51AF0',
});

module.exports.checkoutOnePayDomestic = function Checkout(req, res){
	const checkoutData = res.locals.checkoutData;
	checkoutData.returnUrl = `http://${req.headers.host}/cart/payment/callback`;

	return onepayDom.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
		res.locals.checkoutUrl = checkoutUrl;

		return checkoutUrl;
	});
}

module.exports.callbackOnePayDomestic = function Callback(req, res){
  const query = req.query;
	return onepayDom.verifyReturnUrl(query).then(results => {
		if (results) {
			// res.locals.email = 'sufuijk@gmail.com';
			res.locals.orderId = results.orderId || '';
			res.locals.price = results.amount;

			res.locals.isSucceed = results.isSuccess;
			res.locals.message = results.message;
      //add more

		} else {
			res.locals.isSucceed = false;
		}
	});
}
