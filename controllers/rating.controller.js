const sendResponse = require("../helpers/sendResponse");
const UserOrder = require("../models/UserOrder");
const Product = require("../models/Product");
const Rating = require("../models/Rating");
const ratingController = {};

ratingController.createRating = async (req, res, next) => {
  let result;
  try {
    const owner = req.currentUser._id;
    const { productId, ratings, comments } = req.body;
    if (!productId) {
      throw new Error("Missing info");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Cannot find product");
    }
    const ordered = await UserOrder.findOne({ owner, product });
    if (!ordered) throw new Error("Never ordered this item, cannot create rating");
    const newRating = {
      owner,
      product,
      ratings: rating,
      comments: comment,
    };
    result = await Rating.create(newRating);
    result = await result.populate([
      { path: "owner", select: ["name"] },
      { path: "products.productId", select: "name" },
      { path: "comments", select: "comments" },
      { path: "ratings", select: "ratings" },
    ]);

    const updateRating = await Product.findByIdAndUpdate(
      productId,
      { ...product, rating },
      { new: true }
    );
  } catch (error) {
    return next(error);
  }

  return sendResponse(
    res,
    200,
    true,
    { result, test },
    false,
    "Successfully create rating"
  );
};

ratingController.updateRating = async (req, res, next) => {
  let result;
  try {
    const owner = req.currentUser._id;
    const { productId, rating, comment } = req.body;
    if (!productId) {
      throw new Error("Missing info");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Cannot find product");
    }
    const ordered = await UserOrder.findOne({ owner, product });
    if (!ordered) throw new Error("Never ordered this item, cannot create rating");
    const ratingItem = await Rating.findOne({ owner, productId });
    const rated = await Rating.findOneAndUpdate(
      { owner, productId },
      { ...rating, ratings: rating, comments }
    );

    let allRatings = await Rating.find({ productId });
    let newRating = 0;
    let count = 0;
    for (const ratingItem of allRatings) {
      newRating += ratingItem.ratings;
      count++;
    }
    newRating = newRating / count;

    const updateRating = await Product.findByIdAndUpdate(
      productId,
      { ...product, rating: newRating },
      { new: true }
    );
  } catch (error) {
    return next(error);
  }

  return sendResponse(
    res,
    200,
    true,
    { result, test },
    false,
    "Successfully create rating"
  );
};

module.exports = ratingController;
