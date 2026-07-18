const knowledgeService = require('../services/knowledgeService');
const { HTTP_STATUS } = require('../constants');

/**
 * Maps database Mongoose fields to the lowercase structures expected by the React client.
 * Satisfies the frontend components contracts without changing backend database models.
 */
const mapFileStatus = (file) => {
  if (!file) return null;
  
  const fileObj = file.toObject ? file.toObject() : { ...file };
  
  // Mapping database uppercase statuses to lowercase equivalents
  const statusMap = {
    'UPLOADED': 'completed',
    'PROCESSING': 'processing',
    'READY': 'completed',
    'FAILED': 'failed'
  };
  
  return {
    id: fileObj._id.toString(),
    _id: fileObj._id.toString(),
    name: fileObj.originalName,
    originalName: fileObj.originalName,
    size: fileObj.fileSize,
    fileSize: fileObj.fileSize,
    type: fileObj.fileType,
    fileType: fileObj.fileType,
    status: statusMap[fileObj.status] || 'completed',
    uploadedAt: fileObj.uploadDate || fileObj.processedAt || new Date().toISOString(),
    uploadDate: fileObj.uploadDate,
    extractedTextLength: fileObj.extractedTextLength,
    processedAt: fileObj.processedAt
  };
};

/**
 * Handle incoming document upload requests, execute processing pipeline, and save metadata
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No file provided or file type not allowed. Supports PDF, TXT, DOCX.');
      error.statusCode = 400;
      throw error;
    }

    const filePayload = {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };

    // Execute upload metadata creation and the full chunking pipeline synchronously
    const processedFile = await knowledgeService.createFile(filePayload);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: mapFileStatus(processedFile),
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
      data: files.map(mapFileStatus),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve generated chunks for debugging/testing
 */
const getChunks = async (req, res, next) => {
  try {
    const chunks = await knowledgeService.getChunksByFileId(req.params.id);
    
    // Map response structure precisely matching prompt requirement
    const formattedChunks = chunks.map(chunk => ({
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
    }));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: formattedChunks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve pipeline processing status
 */
const getStatus = async (req, res, next) => {
  try {
    const file = await knowledgeService.getFileById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        status: file.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific knowledge file, related chunks, and disk storage physical copy
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
  getChunks,
  getStatus,
  deleteFile,
};
