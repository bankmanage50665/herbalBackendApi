const { default: mongoose } = require("mongoose");
const Schema =  mongoose.Schema;

const CartItemSchema = new Schema({
  productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const CartSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d", // Cart will be automatically deleted after 30 days
  },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
