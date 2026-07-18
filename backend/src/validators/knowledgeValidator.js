const { param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Middleware handler to extract validation results and format error messages
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: errorMsg,
    });
  }
  next();
};

/**
 * Validate MongoDB ObjectId inside parameters ':id' for knowledge files
 */
const validateFileId = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Must be a valid 24-character hexadecimal MongoDB ID'),
  validateRequest,
];

module.exports = {
  validateFileId,
};
