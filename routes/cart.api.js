const express = require("express");
const authenticationMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const {
  createCart,
  addProductToCart,
  removeProductFromCart,
  deleteCart,
  getSingleCart,
  getAll,
  getAllOwn,
  payCart,
} = require("../controllers/cart.controller");
const router = express.Router();

router.post("/:productId", authenticationMiddleware, createCart);

router.put("/add-product-cart", authenticationMiddleware, addProductToCart);

router.delete(
  "/remove-product-cart/:cartId",
  authenticationMiddleware,
  removeProductFromCart
);
router.delete("/:cartId", authenticationMiddleware, deleteCart);

router.get("/", authenticationMiddleware, getSingleCart);

router.get("/", authenticationMiddleware, isAdmin, getAll);

router.get("/me", authenticationMiddleware, getAllOwn);

router.put("/payment/:cartId", authenticationMiddleware, payCart);

module.exports = router;
