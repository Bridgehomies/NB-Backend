// routes/products.js

const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");

const router = express.Router();

// Set up storage engine for Multer
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

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error); // Log full error
    res.status(500).json({ 
      error: "Failed to fetch products",
      details: error.message
    });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST create new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subcategory,
      inStock,
      dateAdded,
      rating,
      reviews,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      image: imagePath,
      category,
      subcategory,
      inStock: inStock === "true" || inStock === true,
      dateAdded: dateAdded || new Date(),
      rating: parseFloat(rating) || 0,
      reviews: parseInt(reviews) || 0,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// PUT update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subcategory,
      inStock,
      dateAdded,
      rating,
      reviews,
    } = req.body;

    const updateData = {
      name,
      price: parseFloat(price),
      description,
      category,
      subcategory,
      inStock: inStock === "true" || inStock === true,
      dateAdded: dateAdded ? new Date(dateAdded) : undefined,
      rating: parseFloat(rating) || 0,
      reviews: parseInt(reviews) || 0,
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// PUT update sale price
router.put("/:id/sale", async (req, res) => {
  try {
    const { salePrice } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (typeof salePrice !== "number" || salePrice >= product.price) {
      return res.status(400).json({ error: "Sale price must be less than original price" });
    }

    product.salePrice = salePrice;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
