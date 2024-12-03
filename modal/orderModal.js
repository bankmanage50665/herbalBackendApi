const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderModal = new Schema({
  user: {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  items: [
    {
      name: { type: String, required: true },
      image: [{ type: String, required: true }],
      brand: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      creator: { type: String },
    },
  ],
  totalPrice: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  deliveredWillBe: { type: String, required: true },
  orderStatus: { type: String, required: true },

  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

const Order = mongoose.model("Order", orderModal);
module.exports = Order;
