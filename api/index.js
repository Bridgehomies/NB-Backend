const express = require('express');
const serverless = require('serverless-http');

const productsRouter = require('../routes/products');
const categoriesRouter = require('../routes/categories');
const ordersRouter = require('../routes/orders');
const reviewsRouter = require('../routes/reviews');
const authRouter = require('../routes/auth');
const statsRouter = require('../routes/stats');

const app = express();
app.use(express.json());

// On Vercel, DO NOT prefix `/api`
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);
app.use('/stats', statsRouter);

// Wrap Express app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
