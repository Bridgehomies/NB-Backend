// api/index.js - Vercel Serverless Entry
const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --- Import Routes ---
const productRoutes = require("../routes/products");
const orderRoutes = require("../routes/orders");
const statsRoutes = require("../routes/stats");
const reviewsRoutes = require("../routes/reviews");
const categoriesRoutes = require("../routes/categories");
const authRoutes = require("../routes/auth");

const app = express();

// --- CORS Setup ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "https://nabeerabareera.com" // ✅ Live domain
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!", timestamp: new Date() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is working" });
});

// --- MongoDB Connection Caching for Serverless ---
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- DB Middleware ---
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("DB connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// --- API Routes ---
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);

// --- 404 handler ---
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Export wrapped app for Vercel
module.exports = serverless(app);
