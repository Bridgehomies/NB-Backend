// api/index.js - Vercel Serverless Function for Express
const express = require('express');
const server = require('../server'); // points to your server.js (without app.listen)
const { createServer } = require('http');

// Remove any .listen() calls
const app = express();

// Reuse your existing middleware and routes
app.use('/api', server); // assumes server.js exports router or app

module.exports = (req, res) => {
  // Vercel will pass incoming requests here
  return app(req, res);
};