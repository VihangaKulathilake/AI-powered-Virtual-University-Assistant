const fs = require('fs').promises;
const path = require('path');
const knowledgeRepository = require('../repositories/knowledgeRepository');

class KnowledgeService {
  /**
   * Get list of all knowledge files in database
   */
  async getFiles() {
    return knowledgeRepository.findAll();
  }

  /**
   * Save uploaded file metadata to database
   */
  async createFile(fileData) {
    return knowledgeRepository.create(fileData);
  }

  /**
   * Delete file metadata from database and delete local physical file from disk
   */
  async deleteFile(id) {
    const file = await knowledgeRepository.findById(id);
    if (!file) {
      const error = new Error(`Knowledge file not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    // Try unlinking local physical file from uploads folder
    try {
      const filePath = path.join(__dirname, '..', 'uploads', file.storedName);
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`[KnowledgeService] Local file delete fail for ${file.storedName}: ${err.message}`);
      // Proceed even if disk file is missing to prevent database metadata desynchronization
    }

    return knowledgeRepository.delete(id);
  }
}

module.exports = new KnowledgeService();
