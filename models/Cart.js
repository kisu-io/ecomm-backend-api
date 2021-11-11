const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
  owner: {types: Schema.Types.ObjectId, required: true},
  status: {type: String, enum: ['active', 'paid'], default: 'active'},
  products: [
    {
      productId: {type: Schema.Types.ObjectId, required: true},
      qty: {type: Number, required: true},
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
