const authService = require('../services/authService');

/**
 * POST /api/auth/register
 * Creates a new user account. Redirects to login (no auto-login).
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are all required.');
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters.');
      err.statusCode = 400;
      throw err;
    }

    const result = await authService.register(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please log in to continue.',
      data: result.user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (requires protect middleware).
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
