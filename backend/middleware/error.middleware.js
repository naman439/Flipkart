/**
 * Error Handling Middleware
 * Centralized error handler for the Express app
 */

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler
 * Handles Prisma errors, validation errors, and generic errors
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma Errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this information already exists.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint violation.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
