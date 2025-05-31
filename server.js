// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const statsRoutes = require("./routes/stats");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // or your production URL
}));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Apply multer middleware globally if needed
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", statsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
