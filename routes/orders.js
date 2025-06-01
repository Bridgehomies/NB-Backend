// order.js

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
      status: status || "pending", // default to pending
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
