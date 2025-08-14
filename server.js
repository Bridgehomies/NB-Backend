<<<<<<< HEAD
// server.js - Vercel-Compatible, Serverless-Optimized
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const statsRoutes = require("./routes/stats");
const reviewsRoutes = require("./routes/reviews");
const categoriesRoutes = require("./routes/categories");

const app = express();

// --- CORS Setup ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "https://your-frontend.vercel.app" // ✅ Replace with your actual frontend URL
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

// ❌ DO NOT serve static files like this on Vercel
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Remove or comment out

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!", timestamp: new Date() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is working" });
});

// --- MongoDB Connection Caching for Serverless ---
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Middleware: Connect to DB on each request
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("DB connection failed:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);        // Avoid collision
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/categories", categoriesRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Export the Express app (required for Vercel)
module.exports = app;
=======
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
const reviewsRoutes = require("./routes/reviews");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enhanced CORS - allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001", 
  "http://localhost:5000",
  // Add your production frontend URL here if you have one
  "nb-backend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!", timestamp: new Date() });
});

// ✅ API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is working" });
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Optionally attach `upload` middleware globally
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes (prefix all with /api)
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", statsRoutes);
app.use("/api", reviewsRoutes);

// ✅ 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
