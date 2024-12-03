const express = require("express");
const router = express.Router();
const authCheck = require("../../middleware/authCheck");

const adminController = require("../../controller/admin_controller");



router.get("/allUsers", adminController.getAllUsers);
router.get("/:orderId", adminController.getOrderByOrderId);

module.exports = router;
