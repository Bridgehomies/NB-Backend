<<<<<<< HEAD
// routes/categories.js
const express = require("express");
const router = express.Router();
const { SUBCATEGORIES } = require("../constants/subcategories");

router.get("/subcategories", (req, res) => {
  res.json(SUBCATEGORIES);
});

module.exports = router;
=======
// routes/categories.js
const express = require("express");
const router = express.Router();
const { SUBCATEGORIES } = require("../constants/subcategories");

router.get("/subcategories", (req, res) => {
  res.json(SUBCATEGORIES);
});

module.exports = router;
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
