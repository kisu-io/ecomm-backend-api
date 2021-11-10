const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('haha');
});

const userRoutes = require('./user.api');
router.use('/users', userRoutes);

module.exports = router;
