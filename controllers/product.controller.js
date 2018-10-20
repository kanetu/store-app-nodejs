var products = [{
		id: 1,
		name: 'PenChild',
		description: "To get it to pass as an object to a script though you use an exclamation mark with single quotes then parse your object so you can use it. "
	},
	{
		id: 2,
		name: 'Papper',
		description: "To get it to pass as an object to a script though you use an exclamation mark with single quotes then parse your object so you can use it. "
	},
	{
		id: 3,
		name: 'Lognuer',
		description: "To get it to pass as an object to a script though you use an exclamation mark with single quotes then parse your object so you can use it. "
	},
]

module.exports.index = (req,res)=>{
	res.render('product', {products: products})	
}
module.exports.getProduct = (req,res)=>{
	let arr = products.filter((item)=>{
		return item.id == req.params.id
	})
	res.render('product', {products: arr})	
}