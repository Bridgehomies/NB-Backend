<<<<<<< HEAD
// routes/reviews.js

const express = require("express");
const router = express.Router();
const Review = require("../models/Review"); // Ensure this model exists

// GET recent reviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(5);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;
=======
// routes/reviews.js

const express = require("express");
const router = express.Router();
const Review = require("../models/Review"); // Ensure this model exists

// GET recent reviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(5);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
