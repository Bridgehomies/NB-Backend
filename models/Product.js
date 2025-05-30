// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   description: String,
//   image: String,
//   category: String,
//   subcategory: String,
//   inStock: Boolean,
//   dateAdded: String,
//   rating: Number,
//   reviews: Number,
//   salePrice: {
//     type: Number,
//     default: null
//   }
// });

// module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  subcategory: String,
  inStock: Boolean,
  dateAdded: Date,
  rating: Number,
  reviews: Number,
  salePrice: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model("Product", productSchema);
