const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST: Create new order
router.post("/orders", async (req, res) => {
  try {
    const { shippingInfo, paymentMethod, cardDetails, items, total, status } = req.body;

    const newOrder = new Order({
      shippingInfo,
      paymentMethod,
      cardDetails,
      items,
      total,
      status: status || "pending", // default to pending if not provided
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET: All orders
router.get("/orders", async (req, res) => {
  try {
    // Sorting by creation date descending
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT: Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

   if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
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
