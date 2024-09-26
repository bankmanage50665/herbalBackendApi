

const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");
const { check } = require("express-validator");

router.post(
  "/register",
  [check("name").not().isEmpty(), check("phoneNumber").isLength({ min: 10 })],
  userController.register
);
router.post(
  "/sendotp",
  [check("phoneNumber").isLength({ min: 10 })],
  userController.sendOTP
);
router.post(
  "/verify",
  [
    check("phoneNumber").isLength({ min: 10 }),
    check("otp").isLength({ min: 4 }),
  ],
  userController.verifyOtp
);

module.exports = router;
