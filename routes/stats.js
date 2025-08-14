<<<<<<< HEAD
// NB-Backend/routes/stats.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET: Dashboard stats
// GET: Dashboard stats with month-over-month comparison
router.get("/dashboard-metrics", async (req, res) => {
    try {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
      // This month
      const currentOrders = await Order.find({ createdAt: { $gte: startOfThisMonth } });
      const currentRevenue = currentOrders.reduce((acc, o) => acc + o.total, 0);
      const currentCustomers = new Set(currentOrders.map(o => o.shippingInfo?.email)).size;
      const currentConversionRate = ((currentOrders.length / 40000) * 100).toFixed(2); // assume 40k visitors
  
      // Last month
      const previousOrders = await Order.find({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      });
      const previousRevenue = previousOrders.reduce((acc, o) => acc + o.total, 0);
      const previousCustomers = new Set(previousOrders.map(o => o.shippingInfo?.email)).size;
      const previousConversionRate = ((previousOrders.length / 40000) * 100).toFixed(2);
  
      res.json({
        totalRevenue: currentRevenue,
        totalOrders: currentOrders.length,
        totalCustomers: currentCustomers,
        conversionRate: currentConversionRate,
        prev: {
          totalRevenue: previousRevenue,
          totalOrders: previousOrders.length,
          totalCustomers: previousCustomers,
          conversionRate: previousConversionRate
        }
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });
  

router.get("/sales-chart", async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const data = await Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalRevenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(data);
    } catch (err) {
      console.error("Error fetching sales chart data:", err);
      res.status(500).json({ error: "Failed to fetch sales chart data" });
    }
  });

router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
});


router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$items.price", "$items.quantity"] } 
          },
          image: { $first: "$items.image" } // Add this line to get the image
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json(topProducts);
  } catch (err) {
    console.error("Error fetching top products:", err);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});
  

module.exports = router;
=======
// NB-Backend/routes/stats.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET: Dashboard stats
// GET: Dashboard stats with month-over-month comparison
router.get("/dashboard-metrics", async (req, res) => {
    try {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
      // This month
      const currentOrders = await Order.find({ createdAt: { $gte: startOfThisMonth } });
      const currentRevenue = currentOrders.reduce((acc, o) => acc + o.total, 0);
      const currentCustomers = new Set(currentOrders.map(o => o.shippingInfo?.email)).size;
      const currentConversionRate = ((currentOrders.length / 40000) * 100).toFixed(2); // assume 40k visitors
  
      // Last month
      const previousOrders = await Order.find({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      });
      const previousRevenue = previousOrders.reduce((acc, o) => acc + o.total, 0);
      const previousCustomers = new Set(previousOrders.map(o => o.shippingInfo?.email)).size;
      const previousConversionRate = ((previousOrders.length / 40000) * 100).toFixed(2);
  
      res.json({
        totalRevenue: currentRevenue,
        totalOrders: currentOrders.length,
        totalCustomers: currentCustomers,
        conversionRate: currentConversionRate,
        prev: {
          totalRevenue: previousRevenue,
          totalOrders: previousOrders.length,
          totalCustomers: previousCustomers,
          conversionRate: previousConversionRate
        }
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });
  

router.get("/sales-chart", async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const data = await Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalRevenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(data);
    } catch (err) {
      console.error("Error fetching sales chart data:", err);
      res.status(500).json({ error: "Failed to fetch sales chart data" });
    }
  });

router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
});


router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$items.price", "$items.quantity"] } 
          },
          image: { $first: "$items.image" } // Add this line to get the image
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json(topProducts);
  } catch (err) {
    console.error("Error fetching top products:", err);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});
  

module.exports = router;
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
