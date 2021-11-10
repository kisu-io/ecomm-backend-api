const express = require('express');
const router = express.Router();
const {
  getAll,
  createByEmailPassword,
  updateById,
  deleteById,
} = require('../controllers/user.controller');
router.get('/', getAll);

router.post('/', createByEmailPassword);

router.put('/:id', updateById);

router.delete('/:id', deleteById);

module.exports = router;
