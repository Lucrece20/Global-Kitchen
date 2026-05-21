'use strict';

// Load environment variables FIRST — before any other module reads process.env
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipe.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/recipes', recipeRoutes);

// Root health-check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to The Global Kitchen API 🍳',
    version: '1.0.0',
  });
});

// 404 handler for unrecognized routes (must come after all defined routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be registered LAST — Express identifies it by the 4-parameter signature
app.use(errorHandler);

// ─── Database Connection + Server Start ───────────────────────────────────────
// Connect to MongoDB first, then start listening — ensures DB is ready before
// accepting any requests (non-blocking: connectDB is async/await)
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

