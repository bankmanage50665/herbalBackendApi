const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, requird: true },
  image: { type: Array, requird: true },
  brand: { type: String, requird: true },
  category: { type: String, requird: true },
  price: { type: Number, requird: true },
  creator: {type: mongoose.Types.ObjectId, ref: "User"}
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
