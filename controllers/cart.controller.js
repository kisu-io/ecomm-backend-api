const sendResponse = require("../helpers/sendResponse");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const UserOrder = require("../models/UserOrder");
const cartController = {};

cartController.createCart = async (req, res, next) => {
  let test;
  let result;
  try {
    const owner = req.currentUser._id;
    const { productId } = req.params;
    let { qty } = req.body;

    qty = parseInt(qty);
    //check if input is enough
    if (!productId || typeof qty !== "number") {
      throw new Error("Missing info");
    }
    if (qty < 0) {
      throw new Error("Quantity can't be less than 0");
    }
    //check if user already have a cart active
    const activeCart = await Cart.findOne({ owner, status: "active" });
    if (activeCart) throw new Error("Cart already active");
    //check if product id is true
    const found = await Product.findById(productId);
    if (!found) {
      throw new Error("Cannot find product");
    }
    //create product choice object
    const productChoice = { productId, qty };
    //create new cart object to be add to db
    const newCart = {
      owner,
      products: [productChoice],
    };
    //create new cart in model
    result = await Cart.create(newCart);
    //get info from owner-User ref  and products.productId-Product ref
    result = await result.populate([
      { path: "owner", select: ["name", "email"] },
      { path: "products.productId", select: "name" },
    ]);
  } catch (error) {
    return next(error);
  }

  return sendResponse(
    res,
    200,
    true,
    { result, test },
    false,
    "Successfully create shopping cart"
  );
};

cartController.addProductToCart = async (req, res, next) => {
  //owner, productId and qty
  // Operation: find active cart => push new product to found
  //=> find by Id and update by found
  const owner = req.currentUser._id;
  const body = req.body;

  let result;

  try {
    const cartToUpdate = await Cart.findOne({ owner, status: "active" });
    body.map((product) => {
      const qty = parseInt(product.qtu);
      const productId = product.productId;
      cartToUpdate.products.push({ productId, qty });
    });
    result = await Cart.findByIdAndUpdate(cartToupdate._id, cartToUpdate, {
      new: true,
    });
  } catch (error) {
    next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully add item(s) to shopping cart"
  );
};

cartController.removeProductFromCart = async (req, res, next) => {
  let result;
  const { cartId } = req.params;
  let { productId, qty } = req.body;

  try {
    const cartFound = await Cart.findById(cartId);
    // Option 1
    // const newProductList = cartFound.products
    //   .map((existed) => {
    //     const newProduct = {
    //       productId: existed.productId,
    //       qty: existed.productId.equals(productId) ? existed.qty - qty : existed.qty,
    //     };
    //     return newProduct;
    //   })
    //   .filter((e) => e.qty > 0);

    // Option 2
    const newProductList = cartFound.products.filter((existed) => {
      if (existed.productId.equals(productId)) {
        existed.qty -= qty;
      }
      return existed.qty > 0;
    });
    cartFound.products = newProductList;
    result = await Cart.findByIdAndUpdate(cartId, cartFound, { new: true });
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully remove item(s) from shopping cart"
  );
};

cartController.getSingleCart = async (req, res, next) => {
  let result;
  const { cartId } = req.query;
  const owner = req.currentUser._id;

  try {
    result = await Cart.findOne({ owner, _id: cartId }).populate(
      "products.productId"
    );
  } catch (error) {
    return next(error);
  }
  return sendResponse(res, 200, true, result, false, "Successfully get single cart");
};

cartController.getAll = async (req, res, next) => {
  let result = {};
  try {
    result.carts = await Cart.find({}).populate(["owner", "products.productId"]);
    result.count = result.carts.length;
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully get all shopping carts"
  );
};

cartController.getAllOwn = async (req, res, next) => {
  let result = {};
  let owner = req.currentUser._id;
  try {
    result.carts = await Cart.find({ owner }).populate("products.productId");
    result.count = result.carts.length;
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully get user's shopping cart"
  );
};

cartController.payCart = async (req, res, next) => {
  let result = {};
  const { cartId } = req.params;
  const { currentBalance, _id } = req.currentUser;
  try {
    const product = await Cart.findById(cartId).populate("products.productId");
    const total = product.products.reduce(
      (acc, cur) => acc + cur.qty * cur.productId.price,
      0
    );
    if (product.status === "paid") throw new Error("Cart already paid");
    if (total > currentBalance)
      throw new Error("Not enough balance to make the purchase");
    const newBalance = currentBalance - total;
    result.cart = await Cart.findByIdAndUpdate(
      cartId,
      { status: "paid" },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      _id,
      { currentBalance: newBalance },
      { new: true }
    );
    result.currentBalance = user.currentBalance;

    const userOrdered = {
      user,
      product,
    };
    const ordered = await UserOrder.create(userOrdered);
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully paid for shopping cart"
  );
};

cartController.deleteCart = async (req, res, next) => {
  let result;
  const { cartId } = req.params;
  const owner = req.currentUser._id;
  try {
    result = await Cart.findOneAndUpdate(
      { _id: cartId, owner },
      { isDeleted: true },
      { new: true }
    );
  } catch (error) {
    return next(error);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully delete shopping cart"
  );
};

module.exports = cartController;
