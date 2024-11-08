const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const fileUpload = require("../../utils/imageUpload");
const authCheck = require("../../middleware/authCheck");

const productController = require("../../controller/productController");


router.get("/getAllProducts", productController.getAllProducts);
router.get("/:id", productController.productDetail);

router.use(authCheck)
router.post(
  "/add",
  // [
  //   check("name").not().isEmpty(),
  //   check("description").not().isEmpty(),
  //   check("brand").not().isEmpty(),
  //   check("category").not().isEmpty(),
  //   check("price").not().isEmpty(),
  //   check("creator").not().isEmpty(),
  // ],
  fileUpload.array("image", 12),
  productController.createProduct
);



router.patch("/:id", productController.editProducts);
router.delete("/:id", productController.deleteProducts);

module.exports = router;
