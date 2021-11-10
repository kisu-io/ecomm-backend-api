const sendResponse = require('../helpers/sendResponse');
const User = require('../models/User');

const userController = {};
userController.getAll = (req, res) => {
  const result = await User.find();
  return sendResponse(res, 200, true, result, false, 'Successfully get all users');
};

userController.createByEmailPassword = (req, res, next) => {
  const {name, email, password} = req.body;
  let result;
  try {
    if (!name || !email || !password) throw new Error('missing input');
    const found = await User.findOne({email});
    if (found) throw new Error('Email already Registered');
    result = await User.create({name, email, password});
  } catch (err) {
    return sendResponse(res, 420, result, true, error.message);
  }
  return sendResponse(res, 200, true, result, false, 'Successfully create user');
};

userController.updateById = (req, res) => {
  res.send('Find by Id and update');
};

userController.deleteById = (req, res) => {
  res.send('delete by Id and update');
};

module.exports = userController;
