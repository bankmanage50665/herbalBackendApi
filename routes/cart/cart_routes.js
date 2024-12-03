const express = require("express");
const router = express.Router();

const cartController = require("../../controller/cart_controller");

router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.get("/:sessionId", cartController.getSessionId);




module.exports = router;
