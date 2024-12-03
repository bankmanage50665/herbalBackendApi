const twilio = require("twilio");
const OTPGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const HttpError = require("../utils/errorModal");
const User = require("../modal/user_modal");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid user credentials", 401));
  }

  const { phoneNumber } = req.body;

  let user;
  // Check if user already exists
  try {
    user = await User.findOne({ phoneNumber });
  } catch (err) {
    return next(
      new HttpError("Field to find user, Please try again later.", 401)
    );
  }

  if (user) {
    return next(new HttpError("User exist already", 401));
  }

  // Create new user
  user = new User({ phoneNumber, orders: [], products: [] });

  try {
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Field to create new  user, Please try again later.", 401)
    );
  }

  res.status(201).json({
    message: "User registered successfully",

    userId: user.id,
  });
}

async function sendOTP(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid user credentials", 401));
  }

  const { phoneNumber } = req.body;

  const otp = OTPGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });



  try {
    const user = await User.findOneAndUpdat(
      { phoneNumber },

      {
        otp,
        otpExpiration: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
      },
      { new: true, upsert: true } // Create a new user if not found
    );

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // await client.messages.create({
    //   body: `Trendify: Your OTP is: ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${phoneNumber}`,
    // });

    console.log(otp);

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (err) {
    return next(
      new HttpError("Field to send otp, Please try agin later.", 500)
    );
  }
}

async function verifyOtp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid user credentials", 401));
  }

  const { phoneNumber, otp } = req.body;

  console.log(phoneNumber, otp);

  let user;
  try {
    user = await User.findOne({ phoneNumber });
  } catch (err) {
    return next(
      new HttpError(
        "Failed to find user with phone number, Please try again later.",
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError("User not found, Please register first", 404));
  }

  if (user.otp !== otp) {
    return next(new HttpError("Invalid OTP", 404));
  }

  if (user.otpExpiration < new Date()) {
    return next(new HttpError("OTP has expired", 404));
  }

  // Only update fields you need to change
  user.otp = undefined;
  user.otpExpiration = undefined;

  // Log the entire user object before saving

  try {
    await user.save();
  } catch (err) {
    console.error("Error while saving user:", err); // Log the error
    return next(
      new HttpError(
        "Failed to reset user OTP and OTP expiration, Please try again later.",
        500
      )
    );
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "10h",
  });

  res.status(200).json({
    token,
    userId: user._id,
    phoneNumber,
    message: "OTP verified successfully",
  });
}

module.exports = { register, sendOTP, verifyOtp };
