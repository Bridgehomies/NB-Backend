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

    // 👇 Important additions
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Order", orderSchema);
