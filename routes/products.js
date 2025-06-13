// routes/products.js - Updated for multiple images

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

// Updated to handle multiple files
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Predefined categories and their subcategories
const categorySubcategories = {
  jewelry: [
    "Necklaces",
    "Rings",
    "Earrings",
    "Bracelets",
    "Watches",
    "Brooches"
  ],
  "mens-coats": [
    "Winter Coats",
    "Trench Coats",
    "Blazers",
    "Leather Jackets",
    "Bomber Jackets",
    "Parkas"
  ],
  "kids-clothing": [
    "T-Shirts",
    "Dresses",
    "Pants",
    "Shorts",
    "Pajamas",
    "School Uniforms"
  ]
};

// GET category subcategories
router.get("/categories/:category/subcategories", async (req, res) => {
  try {
    const { category } = req.params;
    const subcategories = categorySubcategories[category] || [];
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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

// POST create new product with multiple images
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subcategories,
      inStock,
      dateAdded,
      rating,
      reviews,
    } = req.body;

    // Handle multiple image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Parse subcategories if it's a string (from FormData)
    let parsedSubcategories = [];
    if (subcategories) {
      if (typeof subcategories === 'string') {
        try {
          parsedSubcategories = JSON.parse(subcategories);
        } catch (e) {
          parsedSubcategories = [subcategories];
        }
      } else if (Array.isArray(subcategories)) {
        parsedSubcategories = subcategories;
      }
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      images: imagePaths, // Store array of image paths
      category,
      subcategories: parsedSubcategories,
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

// PUT update product with multiple images
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subcategories,
      inStock,
      dateAdded,
      rating,
      reviews,
      keepExistingImages // Flag to determine if we should keep existing images
    } = req.body;

    // Parse subcategories if it's a string (from FormData)
    let parsedSubcategories = [];
    if (subcategories) {
      if (typeof subcategories === 'string') {
        try {
          parsedSubcategories = JSON.parse(subcategories);
        } catch (e) {
          parsedSubcategories = [subcategories];
        }
      } else if (Array.isArray(subcategories)) {
        parsedSubcategories = subcategories;
      }
    }

    const updateData = {
      name,
      price: parseFloat(price),
      description,
      category,
      subcategories: parsedSubcategories,
      inStock: inStock === "true" || inStock === true,
      dateAdded: dateAdded ? new Date(dateAdded) : undefined,
      rating: parseFloat(rating) || 0,
      reviews: parseInt(reviews) || 0,
    };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      
      if (keepExistingImages === "true") {
        // Get existing product to merge images
        const existingProduct = await Product.findById(req.params.id);
        updateData.images = [...(existingProduct.images || []), ...newImagePaths];
      } else {
        // Replace all images with new ones
        updateData.images = newImagePaths;
      }
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

// DELETE specific image from product
router.delete("/:id/images/:imageIndex", async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= product.images.length) {
      return res.status(400).json({ error: "Invalid image index" });
    }

    // Remove the image at the specified index
    product.images.splice(index, 1);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// PUT update sale price
router.put("/:id/sale", async (req, res) => {
  try {
    const { salePrice } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (salePrice === null) {
      // Remove from sale
      product.salePrice = null;
      product.isSale = false;
    } else {
      if (typeof salePrice !== "number") {
        return res.status(400).json({ error: "Sale price must be a number" });
      }

      if (salePrice >= product.price) {
        return res.status(400).json({ error: "Sale price must be less than original price" });
      }

      product.salePrice = salePrice;
      product.isSale = true;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
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
