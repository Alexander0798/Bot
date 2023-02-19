const {
 Schema,
 model,
} = require("mongoose");

const ReservedBotAccount = new Schema({
 userId: { type: Number, require: true },
 chatId: { type: Number, require: true },
 userName: {type: String, require: true},
 paid: { type: Boolean }, 
 testPeriod: { type: Boolean },
 startUsingDate: { type: String },
 finishUsingDate: { type: String },
})

module.exports = model("ReservedBotAccounts", ReservedBotAccount); 