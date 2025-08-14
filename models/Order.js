<<<<<<< HEAD
// Path: NB-Backend/models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      firstName: String,
      lastName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: String,
    cardDetails: {
      number: String,
      expiry: String,
      cvv: String,
      nameOnCard: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "processing", "ready-to-ship", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Add index for better query performance
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ "shippingInfo.email": 1 });

=======
// Path: NB-Backend/models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      firstName: String,
      lastName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: String,
    cardDetails: {
      number: String,
      expiry: String,
      cvv: String,
      nameOnCard: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "processing", "ready-to-ship", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Add index for better query performance
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ "shippingInfo.email": 1 });

>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
module.exports = mongoose.model("Order", orderSchema);