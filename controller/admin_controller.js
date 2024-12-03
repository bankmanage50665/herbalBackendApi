const HttpError = require("../utils/errorModal");

const Order = require("../modal/orderModal");
const User = require("../modal/user_modal");

async function getAllUsers(req, res, next) {
  let allUsers;
  try {
    allUsers = allUsers = await User.find();
  } catch (err) {
    return next(
      new HttpError("Field to fetch all useres, Please try again later.", 500)
    );
  }

  res.json({
    message: "Find orders sucessfully.",
    users: allUsers.map((orders) => orders.toObject({ getters: true })),
  });
}

async function getOrderByOrderId(req, res, next) {
  const orderId = req.params.orderId;

  if (!orderId) {
    return next(
      new HttpError("Field to get orderid, Please try again later.", 500)
    );
  }

  let findedOrderDetails;
  try {
    findedOrderDetails = await Order.findById(orderId);
  } catch (err) {
    return next(
      new HttpError("Field to get order details, Please try again later.", 500)
    );
  }

  res.json({
    message: "Find order details sucessfully",
    order: findedOrderDetails,
  });
}

module.exports = { getAllUsers, getOrderByOrderId };
