const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

const {
  getAll,
  createByEmailPassword,
  updateById,
  deleteById,
  loginWithEmailPassword,
} = require('../controllers/user.controller');

router.get('/', getAll);

router.post('/', createByEmailPassword);

router.post('/login', loginWithEmailPassword);

router.put('/update-me', authenticationMiddleware, updateById);

router.delete('/delete-me', authenticationMiddleware, deleteById);

module.exports = router;
