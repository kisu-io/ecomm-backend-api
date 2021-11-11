const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const {createProduct, getAllProduct, updateProduct} = require('../controllers/product.controller');

const testFunctions = (req, res, next) => {
  console.log(req.params);
  res.send('product route work');
};
//Get all Product
router.get('/', getAllProduct);
//Get sIngle product Api
router.get('/:productId', testFunctions);
//create product
// admin require
router.post('/', authenticationMiddleware, isAdmin, createProduct);

router.put('/:productId', authenticationMiddleware, isAdmin, updateProduct);

router.delete('/:productId', testFunctions);

module.exports = router;
