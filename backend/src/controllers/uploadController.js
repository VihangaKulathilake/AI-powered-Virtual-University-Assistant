const { HTTP_STATUS } = require('../constants');

/**
 * @desc    Upload academic document for processing
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    const mockFileResponse = {
      id: `doc-${Date.now()}`,
      name: req.file ? req.file.originalname : 'syllabus_preview.pdf',
      size: req.file ? req.file.size : 1245000,
      type: req.file ? req.file.mimetype : 'application/pdf',
      status: 'completed',
      uploadedAt: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.CREATED).json(mockFileResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
};
