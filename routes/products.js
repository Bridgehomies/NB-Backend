// // const express = require('express');
// // const router = express.Router();
// // const Product = require('../models/Product');

// // // Get all products
// // router.get('/', async (req, res) => {
// //   const products = await Product.find();
// //   res.json(products);
// // });

// // // Create new product (optional)
// // router.post('/', async (req, res) => {
// //   const product = new Product(req.body);
// //   await product.save();
// //   res.status(201).json(product);
// // });

// // module.exports = router;

// import express from "express";
// import multer from "multer";
// import Product from "../models/Product.js";
// import path from "path";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const {
//       name,
//       price,
//       category,
//       subcategory,
//       description,
//       inStock,
//       dateAdded,
//       rating,
//       reviews,
//     } = req.body;

//     const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

//     const newProduct = new Product({
//       name,
//       price,
//       category,
//       subcategory,
//       description,
//       image: imagePath,
//       inStock,
//       dateAdded,
//       rating,
//       reviews,
//     });

//     await newProduct.save();

//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error("Error creating product:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all products
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST new product with image
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const {
      name, price, description,
      category, subcategory, inStock,
      dateAdded, rating, reviews
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name, price, description,
      image: imagePath,
      category, subcategory, inStock,
      dateAdded, rating, reviews
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/products/:id', async (req, res) => {
  try {
    const {
      name, price, description, image,
      category, subcategory, inStock,
      dateAdded, rating, reviews
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name, price, description, image,
        category, subcategory, inStock,
        dateAdded, rating, reviews
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// PUT update product sale price
router.put('/products/:id/sale', async (req, res) => {
  try {
    const { salePrice } = req.body;

    if (typeof salePrice !== 'number' || salePrice <= 0) {
      return res.status(400).json({ error: 'Invalid sale price' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (salePrice >= product.price) {
      return res.status(400).json({ error: 'Sale price must be less than regular price' });
    }

    product.salePrice = salePrice;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
