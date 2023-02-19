const {
    Schema,
    model,
   } = require("mongoose");
   
   const SuperUser = new Schema({
    superUserId: { type: Number, require: true },
    
   })
   
   module.exports = model("SuperUser", SuperUser); 