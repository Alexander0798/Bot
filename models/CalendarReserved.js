const {
    Schema,
    model,
   } = require("mongoose");
   
   const CalendarReserved = new Schema({
    superUserId: { type: Number, require: true },
    reservedUsers: { type: Array }
   })
   
   module.exports = model("CalendarReserved", CalendarReserved); 