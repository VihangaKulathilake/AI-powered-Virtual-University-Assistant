const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthService {
  /**
   * Sign a JWT token for the given user
   * @param {string} userId MongoDB User _id
   * @returns {string} Signed JWT token string
   */
  _signToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  /**
   * Register a new user account
   * @param {string} name Full display name
   * @param {string} email User email
   * @param {string} password Plain-text password (will be hashed)
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(name, email, password) {
    // Check for duplicate emails
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const err = new Error('An account with this email already exists. Please log in instead.');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name, email, password });

    // Don't auto-login — return user without token; client will redirect to login
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Authenticate user and return JWT token
   * @param {string} email User email
   * @param {string} password Plain-text password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = this._signToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Verify a JWT token and return the decoded payload
   * @param {string} token JWT string
   * @returns {object} Decoded payload
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
