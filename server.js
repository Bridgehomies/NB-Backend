//  
  const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

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

// Multer setup (only for routes that need file uploads, so we won't apply it globally)
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

// --- Use multer only on routes that require file uploads ---
// Example: if your productRoutes uses image upload, apply multer there instead of globally.
// So REMOVE this line to avoid multer middleware on all requests:
// app.use(upload.single('image'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);  // Auth routes first for clarity
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
