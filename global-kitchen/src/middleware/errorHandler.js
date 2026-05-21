/**
 * Global Error Handler Middleware
 *
 * Catches all errors forwarded via next(error) from any controller.
 * This centralizes error handling — controllers stay clean and DRY.
 *
 * Must be registered LAST in app.js (after all routes) to catch everything.
 * Express identifies it as an error handler by the 4-parameter signature: (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  // Log full error for debugging (in production, swap for a logger like Winston)
  console.error(`[Error] ${err.message}`);

  // Determine the HTTP status code
  // Priority: explicit statusCode on the error > Mongoose validation errors > 500
  let statusCode = err.statusCode || 500;

  // Mongoose ValidationError → 400 Bad Request
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Mongoose CastError (invalid ObjectId format) → 400 Bad Request
  if (err.name === 'CastError') {
    statusCode = 400;
    err.message = `Invalid ID format: ${err.value}`;
  }

  // MongoDB duplicate key error → 409 Conflict
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    err.message = `A recipe with this ${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
