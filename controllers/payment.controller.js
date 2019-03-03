
const { OnePayDomestic } = require('vn-payments');
const { OnePayInternational } = require('vn-payments');

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

	const amount = parseInt(JSON.parse(params.detail).totalPrice, 10);//params.amount.replace(/,/g, '')
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
		orderId: `node-${now.toISOString()}`,
		// returnUrl: ,
		transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
		customerId: params.email,
	};

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
			// res.render('result', {
			// 	title: `Nau Store Payment via ${gateway.toUpperCase()}`,
			// 	isSucceed: res.locals.isSucceed,
			// 	email: res.locals.email,
			// 	orderId: res.locals.orderId,
			// 	price: res.locals.price,
			// 	message: res.locals.message,
			// 	billingStreet: res.locals.billingStreet,
			// 	billingCountry: res.locals.billingCountry,
			// 	billingCity: res.locals.billingCity,
			// 	billingStateProvince: res.locals.billingStateProvince,
			// 	billingPostalCode: res.locals.billingPostalCode,
			// });
      res.send(res.locals.message);
		}).catch((err)=> res.send(err));
	} else {
		res.send('No callback found');
	}
}
