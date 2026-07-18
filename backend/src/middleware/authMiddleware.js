const authService = require('../services/authService');
const User = require('../models/userModel');

/**
 * JWT Authentication middleware.
 * Reads the Authorization: Bearer <token> header, verifies the JWT,
 * and attaches the decoded user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not authenticated. Please log in to access this resource.');
      err.statusCode = 401;
      return next(err);
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT signature and expiry
    const decoded = authService.verifyToken(token);

    // Attach user to request (exclude password)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const err = new Error('The user associated with this token no longer exists.');
      err.statusCode = 401;
      return next(err);
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      const error = new Error('Invalid authentication token. Please log in again.');
      error.statusCode = 401;
      return next(error);
    }
    if (err.name === 'TokenExpiredError') {
      const error = new Error('Your session has expired. Please log in again.');
      error.statusCode = 401;
      return next(error);
    }
    next(err);
  }
};

module.exports = { protect };
