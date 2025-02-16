
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // Fixed typo
  image: { type: Array, required: true }, // Fixed typo
  brand: { type: String, required: true }, // Fixed typo
  price: { type: Number, required: true }, // Fixed typo
  productType: { type: String, required: true },
  productWeight: { type: String, required: true }, // Changed to String
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
