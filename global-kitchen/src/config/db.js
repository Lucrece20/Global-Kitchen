const mongoose = require('mongoose');

/**
 * Establishes a single MongoDB connection using the URI from environment variables.
 * This module is imported once at startup — never reconnect in individual files (DRY).
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure if DB can't be reached
  }
};

module.exports = connectDB;
