const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userOrder = Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamp: true }
);

const UserOrder = mongoose.model("UserOrder", userOrder);
module.exports = UserOrder;
