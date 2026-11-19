// =============================================================================
// FILE: server/src/middleware/errorHandler.js
// PURPOSE: Centralized Error-Handling Middleware for Express.
// EXPRESS CONCEPT: Middleware Pipeline & (err, req, res, next)
// When a middleware function has 4 arguments (err, req, res, next),
// Express recognizes it as an error-handling middleware!
// =============================================================================

// 1. 404 Not Found Middleware (Runs if no route matched)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - Cannot ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the centralized errorHandler below!
};

// 2. Centralized Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // If the response status was still 200, default it to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`💥 [Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // SECURITY CONCEPT: Information Disclosure Prevention
    // In production, NEVER expose the raw error stack trace to the public!
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
