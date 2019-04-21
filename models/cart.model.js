module.exports = function Cart(oldCart){

	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, classify_id, classify){
		var storeItem = this.items[classify_id];
    console.log(storeItem);
		if(!storeItem){
      let customItem = {
        _id: item._id,
        image: item.image[0],
        price: item.price,
        name: item.name
      }
      //cookie chi co 4kb chứa nhìu không được
			this.items[classify_id] = {item: customItem, qty: 0, price:0};
      storeItem = this.items[classify_id];
		}
    storeItem.classify = classify;
		storeItem.qty++;
		storeItem.price = storeItem.item.price * storeItem.qty;
		this.totalQty++;
		this.totalPrice += storeItem.item.price;
	};

	this.removeOneItem = function(classify_id){
		var storeItem = this.items[classify_id];
		if(storeItem.qty <= 1 && storeItem){
			this.totalPrice-=storeItem.item.price;
			this.totalQty--;
			delete this.items[classify_id];
		}else{
			storeItem.qty--;
			storeItem.price = storeItem.item.price * storeItem.qty;
			this.totalQty--;
			this.totalPrice-=storeItem.item.price;
		}


	};

	this.removeAllItem = function(classify_id){
		var storeItem = this.items[classify_id];
		this.totalPrice-=storeItem.item.price  * storeItem.qty;
		this.totalQty-= storeItem.qty;
		delete this.items[classify_id];
	}

	this.generateArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	}

}
