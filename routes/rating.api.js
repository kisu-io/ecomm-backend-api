const express = require("express");
const authenticationMiddleware = require("../middlewares/auth.middleware");
const { createRating } = require("../controllers/rating.controller.js");

const router = express.Router();

router.post("/", authenticationMiddleware, createRating);

module.exports = router;
