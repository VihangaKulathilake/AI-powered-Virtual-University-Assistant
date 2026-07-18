/**
 * Global centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Capture status code (default 500) and base message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format detailed error for developer mode, fallback to message in production
  const errorDetail = err.stack || err.message || err;
  const errorDescription = process.env.NODE_ENV === 'production' 
    ? message 
    : errorDetail.toString();

  console.error(`[Error Handler] ${statusCode} - ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Consistent API error JSON payload structure
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDescription,
  });
};

module.exports = { errorHandler };
