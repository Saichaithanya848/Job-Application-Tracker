/**
 * Middleware to catch 404 Not Found for undefined routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized error handling middleware.
 * Formats errors uniformly across the entire API.
 */
const errorHandler = (err, req, res, next) => {
  // If status code is 200, default to 500 internal server error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found: Invalid ID format';
  }

  // Handle Mongoose duplicate key error (e.g. registered email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists.`;
  }

  // Handle Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace during development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
