const { body, param, validationResult } = require('express-validator');
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
 * Validate standard MongoDB ObjectId inside request parameters ':id'
 */
const validateId = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Must be a valid 24-character hexadecimal MongoDB ID'),
  validateRequest,
];

/**
 * Validate standard MongoDB ObjectId inside request parameters ':chatId'
 */
const validateChatId = [
  param('chatId')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Must be a valid 24-character hexadecimal MongoDB ID'),
  validateRequest,
];

/**
 * Validate chat session creation body fields
 */
const validateCreateChat = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a valid string')
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty if provided'),
  validateRequest,
];

/**
 * Validate message submission body fields
 */
const validateCreateMessage = [
  body('content')
    .isString()
    .withMessage('Message content must be a valid string')
    .trim()
    .notEmpty()
    .withMessage('Message content is required and cannot be empty'),
  validateRequest,
];

module.exports = {
  validateId,
  validateChatId,
  validateCreateChat,
  validateCreateMessage,
};
