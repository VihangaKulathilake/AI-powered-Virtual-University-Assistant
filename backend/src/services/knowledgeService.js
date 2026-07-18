const fs = require('fs').promises;
const path = require('path');
const knowledgeRepository = require('../repositories/knowledgeRepository');
const chunkRepository = require('../repositories/ChunkRepository');
const documentParserService = require('./documentParserService');
const textCleaningService = require('./textCleaningService');
const textChunkingService = require('./textChunkingService');

class KnowledgeService {
  /**
   * Get list of all knowledge files in database
   */
  async getFiles() {
    return knowledgeRepository.findAll();
  }

  /**
   * Get a specific file metadata by ID
   */
  async getFileById(id) {
    const file = await knowledgeRepository.findById(id);
    if (!file) {
      const error = new Error(`Knowledge file not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return file;
  }

  /**
   * Run the document processing pipeline on an uploaded file
   * @param {object} fileData Metadata from upload
   */
  async createFile(fileData) {
    // Step 1: Create KnowledgeFile record in UPLOADED status
    let knowledgeFile = await knowledgeRepository.create({
      ...fileData,
      status: 'UPLOADED',
    });

    const fileId = knowledgeFile._id;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadDir, fileData.storedName);

    try {
      // Step 2: Transition status to PROCESSING
      knowledgeFile = await knowledgeRepository.updateProcessingStatus(fileId, 'PROCESSING');

      // Step 3: Extract text from file
      const parseResult = await documentParserService.parseDocument(filePath, fileData.fileType);
      const rawText = parseResult.text;

      // Step 4: Clean extracted text
      const cleanText = textCleaningService.cleanText(rawText);

      // Step 5: Split text into chunks
      const chunks = textChunkingService.createChunks(cleanText);

      // Step 6: Save chunks to database if any exist
      if (chunks.length > 0) {
        const chunkDocuments = chunks.map(chunk => ({
          fileId: fileId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
        }));
        await chunkRepository.createManyChunks(chunkDocuments);
      }

      // Step 7: Update status to READY with length and processedAt timestamp
      knowledgeFile = await knowledgeRepository.updateExtractedTextLength(fileId, cleanText.length);
      
      // Update status and processedAt fields directly using findByIdAndUpdate
      const KnowledgeFileModel = require('../models/knowledgeFileModel');
      knowledgeFile = await KnowledgeFileModel.findByIdAndUpdate(
        fileId,
        {
          status: 'READY',
          processedAt: new Date(),
        },
        { new: true }
      );

      return knowledgeFile;
    } catch (err) {
      console.error(`[KnowledgeService] Pipeline failure on file ${fileId}: ${err.message}`);
      
      // Update status to FAILED in database
      await knowledgeRepository.updateProcessingStatus(fileId, 'FAILED');
      
      // Rethrow error to be handled by error handler middleware
      throw err;
    }
  }

  /**
   * Delete file metadata record, cascade chunks removal, and delete local physical file from disk
   */
  async deleteFile(id) {
    const file = await knowledgeRepository.findById(id);
    if (!file) {
      const error = new Error(`Knowledge file not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    const fileId = file._id;

    // 1. DeleteRelated chunks from database
    await chunkRepository.deleteByFileId(fileId);

    // 2. Try unlinking local physical file from uploads folder
    try {
      const filePath = path.join(__dirname, '..', 'uploads', file.storedName);
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`[KnowledgeService] Local disk file delete failure for ${file.storedName}: ${err.message}`);
    }

    // 3. Delete knowledge file metadata record from database
    return knowledgeRepository.delete(fileId);
  }

  /**
   * Get all chunks associated with a specific file ID (for debugging/testing)
   */
  async getChunksByFileId(fileId) {
    // Verify file exists first
    const file = await this.getFileById(fileId);
    return chunkRepository.findByFileId(file._id);
  }
}

module.exports = new KnowledgeService();
