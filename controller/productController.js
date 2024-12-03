const { default: mongoose } = require("mongoose");
const fs = require("fs");

const User = require("../modal/user_modal");
const Product = require("../modal/product_modal");
const HttpError = require("../utils/errorModal");
const { validationResult } = require("express-validator");

async function createProduct(req, res, next) {
  const err = validationResult(req);

  // if (!err.isEmpty) {
  //   return next(new HttpError("Invalid inputs creditentials", 422));
  // }

  const { name, description, brand, category, price, creator } = req.body;

console.log(name, description)

  const createdProduct = new Product({
    name,
    description,
    image: req.files.map((file) => file.path),
    brand,
    category,
    price,
    creator,
  });

  let findProductCreatorUser;
  try {
    findProductCreatorUser = await User.findById(creator);
  } catch (err) {
    return next(
      new HttpError(
        "Field to find user that create product by creator id.",
        500
      )
    );
  }

  if (!findProductCreatorUser) {
    return next(new HttpError("Couldn't  find user creator id.", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    findProductCreatorUser.products.push(createdProduct);
    await findProductCreatorUser.save({ session: sess });
    await sess.commitTransaction();
    await createdProduct.save();
  } catch (err) {
    return next(
      new HttpError("Field to create new product, Please try again later.", 500)
    );
  }

  res.json({ message: "Product created sucessfully", createdProduct });
}

async function getAllProducts(req, res, next) {
  const allProduct = await Product.find();

  res.json({ message: "Product find sucessfully.", allProduct });
}

async function productDetail(req, res, next) {
  const productId = req.params.id;

  let findProduct;
  try {
    findProduct = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Field to find product", 500));
  }
  if (!findProduct) {
    return next(new HttpError("Product not found", 404));
  }
  res.json({
    message: "Find product sucessfully.",
    findProduct: findProduct.toObject({ getters: true }),
  });
}

async function editProducts(req, res, next) {
  const productId = req.params.id;
  const { name, description, price, brand, category } = req.body;

  let findProduct;
  try {
    findProduct = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Field to find product", 500));
  }

  findProduct.name = name;
  findProduct.description = description;
  findProduct.price = price;
  findProduct.brand = brand;
  findProduct.category = category;

  if (!findProduct) {
    return next(new HttpError("Product not found", 404));
  }

  try {
    await findProduct.save();
  } catch (err) {
    return next(new HttpError("Field to update product.", 500));
  }
  res.json({ message: "Product update sucessfully.", findProduct });
}

async function deleteProducts(req, res, next) {
  const productId = req.params.id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Field to find product for deleteing", 500));
  }

  if (!product) {
    return next(
      new HttpError("Product not found on database for deleteing.", 404)
    );
  }

  product.image.forEach((file) =>
    fs.unlink(file, (err) => {
      console.log(err);
    })
  );

  try {
    await product.deleteOne();
  } catch (err) {
    return next(new HttpError("Field to delete product", 500));
  }

  res.json({ message: "Product delete sucessfully" });
}
module.exports = {
  createProduct,
  getAllProducts,
  productDetail,
  editProducts,
  deleteProducts,
};
