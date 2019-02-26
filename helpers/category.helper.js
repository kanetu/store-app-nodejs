'use strict'

module.exports.f = function(t, c, ct) {
    // The output structure
    var a = [];
    for( var key in t){
      if(t[key] === c){
        a.push({
            _id: key,
            name: ct.find(item=>{return item._id == key}).name,
            // The `sub` property's value is generated recursively
            sub: this.f(t, key, ct)
        });
      }
    }
    // Finish by returning the `a` array
    return a;
}
