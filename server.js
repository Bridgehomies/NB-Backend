// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const multer = require('multer');
// // const path = require('path');
// // require('dotenv').config();

// // const Order = require('./models/Order'); // Order model
// // const Product = require('./models/Product'); // Product model

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve image files

// // // MongoDB Connection
// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true
// // }).then(() => console.log('MongoDB Connected'))
// //   .catch(err => console.error('MongoDB connection error:', err));

// // // Multer setup for image upload
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, 'uploads/'),
// //   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// // });
// // const upload = multer({ storage });

// // // ===================== PRODUCT ROUTES ===================== //

// // // GET all products
// // app.get('/api/products', async (req, res) => {
// //   const products = await Product.find();
// //   res.json(products);
// // });

// // // GET single product by ID
// // app.get('/api/products/:id', async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
// //     if (!product) return res.status(404).json({ message: 'Product not found' });
// //     res.json(product);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Something went wrong' });
// //   }
// // });

// // // POST new product with image upload
// // app.post('/api/products', upload.single('image'), async (req, res) => {
// //   try {
// //     const {
// //       name, price, description,
// //       category, subcategory, inStock,
// //       dateAdded, rating, reviews
// //     } = req.body;

// //     const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

// //     const product = new Product({
// //       name, price, description,
// //       image: imagePath,
// //       category, subcategory, inStock,
// //       dateAdded, rating, reviews
// //     });

// //     await product.save();
// //     res.status(201).json({ message: 'Product created successfully', product });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to create product' });
// //   }
// // });

// // // PUT update product
// // app.put('/api/products/:id', async (req, res) => {
// //   try {
// //     const {
// //       name, price, description, image,
// //       category, subcategory, inStock,
// //       dateAdded, rating, reviews
// //     } = req.body;

// //     const updatedProduct = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         name, price, description, image,
// //         category, subcategory, inStock,
// //         dateAdded, rating, reviews
// //       },
// //       { new: true }
// //     );

// //     if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
// //     res.json({ message: 'Product updated', product: updatedProduct });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to update product' });
// //   }
// // });

// // // DELETE product
// // app.delete('/api/products/:id', async (req, res) => {
// //   try {
// //     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
// //     if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
// //     res.json({ message: 'Product deleted' });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to delete product' });
// //   }
// // });

// // // PUT update product with sale price
// // app.put('/api/products/:id/sale', async (req, res) => {
// //   try {
// //     const { salePrice } = req.body;

// //     if (typeof salePrice !== 'number' || salePrice <= 0) {
// //       return res.status(400).json({ error: 'Invalid sale price' });
// //     }

// //     const product = await Product.findById(req.params.id);
// //     if (!product) return res.status(404).json({ error: 'Product not found' });

// //     if (salePrice >= product.price) {
// //       return res.status(400).json({ error: 'Sale price must be less than regular price' });
// //     }

// //     product.salePrice = salePrice;
// //     await product.save();

// //     res.json(product);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });


// // // ===================== ORDER ROUTES ===================== //

// // // POST new order
// // app.post('/api/orders', async (req, res) => {
// //   try {
// //     const { name, email, phone, address, productIds } = req.body;

// //     const newOrder = new Order({
// //       name,
// //       email,
// //       phone,
// //       address,
// //       productIds
// //     });

// //     const savedOrder = await newOrder.save();
// //     res.status(201).json(savedOrder);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to place order' });
// //   }
// // });

// // // GET all orders
// // app.get('/api/orders', async (req, res) => {
// //   try {
// //     const orders = await Order.find().sort({ createdAt: -1 });
// //     res.json(orders);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch orders' });
// //   }
// // });
// // // Update order status
// // app.put('/orders/:id/status', async (req, res) => {
// //   try {
// //     const { status } = req.body;
// //     const updatedOrder = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       { status },
// //       { new: true }
// //     );
// //     res.status(200).json(updatedOrder);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to update order status' });
// //   }
// // });


// // // ===================== START SERVER ===================== //
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// require('dotenv').config();

// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });
// app.use(upload.single('image')); // Apply multer globally (or use inside route if needed)

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api', productRoutes);
// app.use('/api', orderRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.use(upload.single('image'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use("/api", statsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
