const express = require('express');
const productsRouter = require('../routes/products');
const categoriesRouter = require('../routes/categories');
const ordersRouter = require('../routes/orders');
const reviewsRouter = require('../routes/reviews');
const authRouter = require('../routes/auth');
const statsRouter = require('../routes/stats');

const app = express();
app.use(express.json());

// Detect if running on Vercel (serverless)
const isVercel = process.env.VERCEL === '1';

// In local dev, keep /api/... routes
// In Vercel, drop the extra /api (because Vercel adds it automatically)
const prefix = isVercel ? '' : '/api';

// Routes
app.use(`${prefix}/products`, productsRouter);
app.use(`${prefix}/categories`, categoriesRouter);
app.use(`${prefix}/orders`, ordersRouter);
app.use(`${prefix}/reviews`, reviewsRouter);
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/stats`, statsRouter);

// Export for Vercel
module.exports = app;
