const { Schema, model } = require("mongoose");

const CustomerAccount = new Schema({
  userId: { type: Number, require: true },
  chatId: { type: Number, require: true },
  userName: { type: String, require: true },
  userReserved: { type: Array },
});

module.exports = model("CustomerAccount", CustomerAccount);
