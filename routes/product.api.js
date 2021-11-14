const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controllers/product.controller");

const testFunctions = (req, res, next) => {
  console.log(req.params);
  res.send("product route work");
};
/**
 * Description: Get all product
 * Access : public
 */
router.get("/", getAllProduct);
/**
 * Description: Get single product by id
 * Access : public
 */
router.get("/:productId", getSingleProduct);
/**
 * Description:  Create product
 * Access : Admin require
 */
router.post("/", authenticationMiddleware, isAdmin, createProduct);
/**
 * Description: Update product
 * Access : admin role required
 */
router.put("/:productId", authenticationMiddleware, isAdmin, updateProduct);
/**
 * Description: Delete product
 * Access : authenticated user
 */
router.delete("/:productId", authenticationMiddleware, isAdmin, deleteProduct);

module.exports = router;
