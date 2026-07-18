/**
 * Chat request body validator
 */
const validateMessageInput = (req, res, next) => {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: message content cannot be empty and must be a string.',
    });
  }
  next();
};

/**
 * Chat session creator validator
 */
const validateSessionInput = (req, res, next) => {
  const { title } = req.body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: session title must be a valid string.',
    });
  }
  next();
};

module.exports = {
  validateMessageInput,
  validateSessionInput,
};
