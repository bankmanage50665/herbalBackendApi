const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  phoneNumber: { type: Number, required: true, unique: true },
  otp: { type: String, required: false },
  otpExpiration: { type: Date, required: false },

  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
  orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
