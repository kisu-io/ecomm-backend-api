const sendResponse = require('../helpers/sendResponse');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const userController = {};
const SALT_ROUND = parseInt(process.env.SALT_ROUND);

userController.getAll = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  let result;
  let count = 0;
  try {
    result = await User.find({isDeleted: false})
      .sort({createAt: -1})
      .limit(limit)
      .skip(limit * (page - 1));
    count = result.length;
  } catch (error) {
    return next(error);
  }

  return sendResponse(res, 200, true, {result, count}, false, 'Successfully get all users');
};

userController.createByEmailPassword = async (req, res, next) => {
  const {name, email} = req.body;
  let {password} = req.body;
  let result;
  try {
    if (!name || !email || !password) throw new Error('missing input');
    const found = await User.findOne({email});
    if (found) throw new Error('Email already Registered');
    const salt = await bcrypt.genSalt(SALT_ROUND);
    password = await bcrypt.hash(password, salt);
    result = await User.create({name, email, password});
  } catch (err) {
    return next(error);
  }
  return sendResponse(res, 200, true, result, false, 'Successfully create user');
};

userController.loginWithEmailPassword = async (req, res, next) => {
  const {email, password} = req.body;
  let result;
  try {
    if (!email || !password) throw new Error('Please input email & password');
    const user = await User.findOne({email, isDeleted: false});
    if (!user) throw new Error('User with the email not found');
    let isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      result = await user.generateToken();
    } else {
      throw new Error('Password not matched');
    }
  } catch (error) {
    return next(error);
  }
  return sendResponse(res, 200, true, result, false, 'Successfully login');
};

userController.updateById = async (req, res) => {
  let result;
  const allowOptions = ['name', 'email'];
  const updateObject = {};

  try {
    allowOptions.forEach((option) => {
      if (req.body[option] !== undefined) {
        updateObject[option] = req.body[option];
      }
    });
    result = await User.findByIdAndUpdate(req.currentUser._id, updateObject, {new: true});
  } catch (error) {
    return next(error);
  }
  return sendResponse(res, 200, true, result, false, 'Successfully update user by Id');
};

userController.deleteById = async (req, res, next) => {
  //soft delete
  try {
    await User.findByIdAndUpdate(req.currentUser._id, {
      isDeleted: true,
    });
  } catch (error) {
    next(error);
  }
  return sendResponse(res, 200, true, null, false, 'Successfully delete user');
};

module.exports = userController;
