const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("haha");
});

const userRoutes = require("./user.api");
router.use("/users", userRoutes);

const productRoutes = require("./product.api");
router.use("/products", productRoutes);

const cartRoutes = require("./cart.api");
router.use("/carts", cartRoutes);

const ratingRoutes = require("./rating.api");
router.use("/rating", ratingRoutes);

module.exports = router;
