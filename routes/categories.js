// routes/categories.js
const express = require("express");
const router = express.Router();
const { SUBCATEGORIES } = require("../constants/subcategories");

router.get("/subcategories", (req, res) => {
  res.json(SUBCATEGORIES);
});

module.exports = router;
