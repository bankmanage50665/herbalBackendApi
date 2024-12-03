const jwt = require("jsonwebtoken");
const HttpError = require("../utils/errorModal");

async function authCheck(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    

    if (!token) {
      throw new Error("Failed to get JWT.");
    }

    const decoded =  jwt.verify(token, process.env.JWT_KEY);

    req.userData = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return next(new HttpError("Failed to verify JWT.", 401));
  }
}

module.exports = authCheck;
