const express = require("express");
const router = express.Router();
const orderController = require("../../controller/order_controller");
const authCheck = require("../../middleware/authCheck")


router.get("/get", orderController.getOrders);
router.get("/:id", orderController.userOrderByUserId);


router.use(authCheck)


router.post("/place", orderController.placeOrder);


router.patch("/:id", orderController.updateOrder)
router.delete("/:id", orderController.deleteOrder)

module.exports = router;
