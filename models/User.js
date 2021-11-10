const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
  },
  {timestamp: true}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
