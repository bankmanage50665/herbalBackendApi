const mongoose = require("mongoose");

const Order = require("../modal/orderModal");
const HttpError = require("../utils/errorModal");
const User = require("../modal/user_modal");

async function placeOrder(req, res, next) {
  const { user, items, totalQuantity, totalPrice } = req.body;

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  let deliveryDate = currentDate.toLocaleDateString("en-GB");

 

  const createdOrder = new Order({
    user,
    items,
    creator: req.userData.userId,
    totalQuantity,
    totalPrice,

    deliveredWillBe: deliveryDate,
    paymentStatus: "Unpaid",
    orderStatus: "Dispatch",
  });

  let findUser;
  try {
    findUser = await User.findById(req.userData.userId);

    if (!findUser) {
      return next(new HttpError("User not found on order.", 404));
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return next(
      new HttpError("Failed to create order due to user lookup failure.", 500)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdOrder.save({ session: sess });
    findUser.orders.push(createdOrder);
    await findUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.error("Error creating order:", err);
    return next(new HttpError("Failed to create order.", 500));
  }

  res.json({ message: "Order placed successfully.", createdOrder });
}

async function getOrders(req, res, next) {
  const orders = await Order.find();
  res.json({
    message: "Find orders sucessfully.",
    orders: orders.map((orders) => orders.toObject({ getters: true })),
  });
}

async function userOrderByUserId(req, res, next) {
  const userId = req.params.id;

  if (!userId) {
    return next(new HttpError("Couldn't find userid.", 500));
  }

  let findOrderByUserId;
  try {
    findOrderByUserId = await User.findById(userId).populate("orders");
  } catch (err) {
    return next(
      new HttpError("Field to find user orders, Please try again later", 500)
    );
  }

 

  res.json({
    message: "Find user orders sucessfully.",
    orders: findOrderByUserId.toObject({ getters: true }),
  });
}

async function updateOrder(req, res, next) {
  const orderid = req.params.id;

  if (!orderid) {
    return next(new HttpError("Couldn't find orderid.", 500));
  }

  const { orderStatus, paymentStatus, deliveredWillBe } = req.body;

  let findOrderByIdForUpdate;
  try {
    findOrderByIdForUpdate = await Order.findById(orderid);
  } catch (err) {
    return next(
      new HttpError("Field to find  orders by id, Please try again later", 500)
    );
  }

  // const orderCreatorId = findOrderByIdForUpdate.creator.toString();
  // const userid = req.userData.userId;

  // if (userid !== orderCreatorId) {
  //   return next(
  //     new HttpError(
  //       "Field to update order status, You'r not authorized to update this order status",
  //       404
  //     )
  //   );
  // }

  findOrderByIdForUpdate.orderStatus = orderStatus;
  findOrderByIdForUpdate.paymentStatus = paymentStatus;
  findOrderByIdForUpdate.deliveredWillBe = deliveredWillBe;

  try {
    await findOrderByIdForUpdate.save();
  } catch (err) {
    return next(
      new HttpError("Field to update order status, Please try again later", 500)
    );
  }

  res.json({
    message: "Update order stutes sucessfully.",
    updateOrder: findOrderByIdForUpdate.toObject({ getters: true }),
  });
}

async function deleteOrder(req, res, next) {
  const orderId = req.params.id;

  if (!orderId) {
    return next(new HttpError("Order ID is required.", 400));
  }

  let order;

  try {
    order = await Order.findById(orderId);
  } catch (err) {
    return next(
      new HttpError("Field to find order, Please try again later", 500)
    );
  }

  if (!order) {
    return next(new HttpError("Order not found.", 404));
  }

  let user;
  try {
    user = await User.findById(order.creator);
  } catch (err) {
    return next(
      new HttpError(
        "Field to find user for update, Please try again later",
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError("User not found.", 404));
  }

  // const orderCreatorId = order.creator.toString();
  // const userid = req.userData.userId;

  // if (orderCreatorId !== userid) {
  //   return next(
  //     new HttpError("You are not authorized to delete this order.", 401)
  //   );
  // }

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await order.deleteOne({ session });
    user.orders.pull(order._id);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    return next(
      new HttpError("Failed to delete order. Please try again later.", 500)
    );
  } finally {
    session.endSession();
  }

  res.json({ message: "Order deleted successfully." });
}
module.exports = {
  placeOrder,
  getOrders,
  userOrderByUserId,
  updateOrder,
  deleteOrder,
};
