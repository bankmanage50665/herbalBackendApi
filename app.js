const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
require("dotenv").config();

const userRouter = require("./routes/user/user_routes");
const HttpError = require("./utils/errorModal");
const productRoutes = require("./routes/products/products_routes");
const orderRouter = require("./routes/user/order_routes");
const adminRouter = require("./routes/user/admin_routes");
const reviewRouter = require("./routes/products/review_routes");

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.wdrbduw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "https://ecommerce50665.web.app", // Add both production and local URLs
    // origin: "http://localhost:3001", // Add both production and local URLs
    credentials: true,
  })
);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/users", userRouter);
app.use("/products", productRoutes);
app.use("/orders", orderRouter);
app.use("/admin", adminRouter);
app.use("/review", reviewRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.files.forEach((file) => file.path));
  }

  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({
    message: err.message || "Something went wrong, Please try again later.",
  });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(url)
  .then((req, res) => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(PORT);
    console.log(err);
  });
