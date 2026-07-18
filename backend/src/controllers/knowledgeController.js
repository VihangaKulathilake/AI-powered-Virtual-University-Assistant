const knowledgeService = require('../services/knowledgeService');
const { HTTP_STATUS } = require('../constants');

/**
 * Handle incoming document upload requests from Multer and save metadata
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No file provided or file type not allowed. Supports PDF, TXT, DOCX.');
      error.statusCode = 400;
      throw error;
    }

    const fileData = {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: 'completed', // Defaults to completed once written locally
    };

    const newFile = await knowledgeService.createFile(fileData);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: newFile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve list of all uploaded knowledge files
 */
const getFiles = async (req, res, next) => {
  try {
    const files = await knowledgeService.getFiles();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific knowledge file and clean it from disk storage
 */
const deleteFile = async (req, res, next) => {
  try {
    await knowledgeService.deleteFile(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: null,
      message: 'Knowledge resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
};
