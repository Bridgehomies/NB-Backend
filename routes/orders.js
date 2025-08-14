<<<<<<< HEAD
// NB-Backend/routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: Create new order + send confirmation email
router.post("/orders", async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, cardDetails, items, total } = req.body;

    if (!shippingInfo || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save order to DB
    const newOrder = new Order({
      shippingInfo,
      paymentMethod,
      cardDetails: paymentMethod === "code" ? cardDetails : undefined,
      items,
      total,
      status: "pending",
    });

    await newOrder.save();

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: shippingInfo.email,
      subject: `Your Order #${newOrder._id} has been placed!`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>We're excited to let you know that your order has been successfully placed.</p>

        <h3>Order ID: ${newOrder._id}</h3>
        <h3>Customer: ${shippingInfo.firstName} ${shippingInfo.lastName}</h3>
        <h3>Email: ${shippingInfo.email}</h3>

        <h4>Order Details:</h4>
        <ul>
          ${items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
        </ul>

        <p><strong>Total: $${total.toFixed(2)}</strong></p>
        <p>Payment Method: ${paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}</p>

        <p>Thanks again for shopping with us!</p>
        <p>The Nabeera Baeera Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET: All orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET: Latest order for confirmation (NEW ENDPOINT)
router.get("/api/order/confirmation", async (req, res) => {
  try {
    // Get the most recent order
    const latestOrder = await Order.findOne().sort({ createdAt: -1 });
    
    if (!latestOrder) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({
      orderId: latestOrder._id,
      createdAt: latestOrder.createdAt,
      // You can include other relevant order data here
    });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    res.status(500).json({ error: "Failed to fetch order confirmation" });
  }
});

// PUT: Update order status with allowed transitions
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "ready-to-ship", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const allowedTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["ready-to-ship", "cancelled"],
      "ready-to-ship": ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentOrder.status].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from '${currentOrder.status}' to '${status}'`,
      });
    }

    currentOrder.status = status;
    await currentOrder.save();

    res.status(200).json(currentOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// DELETE: Remove an order by ID
router.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
=======
// routes/order.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: Create new order + send confirmation email
router.post("/orders", async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, cardDetails, items, total } = req.body;

    if (!shippingInfo || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save order to DB
    const newOrder = new Order({
      shippingInfo,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
      items,
      total,
      status: "pending",
    });

    await newOrder.save();

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: shippingInfo.email,
      subject: `Your Order #${newOrder._id} has been placed!`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>We're excited to let you know that your order has been successfully placed.</p>

        <h3>Order ID: ${newOrder._id}</h3>
        <h3>Customer: ${shippingInfo.firstName} ${shippingInfo.lastName}</h3>
        <h3>Email: ${shippingInfo.email}</h3>

        <h4>Order Details:</h4>
        <ul>
          ${items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
        </ul>

        <p><strong>Total: $${total.toFixed(2)}</strong></p>
        <p>Payment Method: ${paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}</p>

        <p>Thanks again for shopping with us!</p>
        <p>The Nabeera Baeera Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET: All orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT: Update order status with allowed transitions
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "ready-to-ship", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const allowedTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["ready-to-ship", "cancelled"],
      "ready-to-ship": ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentOrder.status].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from '${currentOrder.status}' to '${status}'`,
      });
    }

    currentOrder.status = status;
    await currentOrder.save();

    res.status(200).json(currentOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// DELETE: Remove an order by ID
router.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
