<<<<<<< HEAD
// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: [{ type: String }],
  category: String,
  subcategories: [String], 
  inStock: Boolean,
  dateAdded: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    default: null
  }
});

=======
// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: [{ type: String }],
  category: String,
  subcategories: [String], 
  inStock: Boolean,
  dateAdded: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    default: null
  }
});

>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
module.exports = mongoose.model("Product", productSchema);