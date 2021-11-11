const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: {type: String, required: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    isDeleted: {type: Boolean, default: false},
  },
  {timestamp: true}
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
