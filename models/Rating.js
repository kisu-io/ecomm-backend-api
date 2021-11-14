const mongoose = require("mongoose");
const Product = require("./Product");
const Schema = mongoose.Schema;

const ratingSchema = Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    ratings: { type: Number, required: true },
    comments: { type: String },
  },
  { timestamp: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
