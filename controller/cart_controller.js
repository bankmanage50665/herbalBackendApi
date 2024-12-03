const Cart = require("../modal/cart_modal");
const Product = require("../modal/product_modal");
const HttpError = require("../utils/errorModal");

async function addToCart(req, res, next) {
  const { productId, quantity, sessionId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = new Cart({ sessionId, items: [] });
  }

  const cartItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (cartItemIndex > -1) {
    cart.items[cartItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.price });
  }

  await cart.save();

  res.json({
    message: "Product add to cart sucessfully",
    product: product.toObject({ getters: true }),
  });
}

async function removeFromCart(req, res, next) {
  const { sessionId, productId, quantity } = req.body;

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (cartItemIndex > -1) {
    cart.items[cartItemIndex].quantity -= quantity;

    if (cart.items[cartItemIndex].quantity <= 0) {
      cart.items.splice(cartItemIndex, 1);
    }

    if (cart.items.length === 0) {
      await Cart.deleteOne({ sessionId });
      return res.status(200).json({ message: "Cart is now empty" });
    }

    await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: "Item not found in cart" });
  }
}

async function getSessionId(req, res, next) {
  const { sessionId } = req.params;

  console.log(sessionId)

  const cart = await Cart.findOne({ sessionId }).populate("items.productId");

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json({
    message: "Cart items find sucessfully",
    cart,
  });
}

module.exports = { addToCart, removeFromCart, getSessionId };
