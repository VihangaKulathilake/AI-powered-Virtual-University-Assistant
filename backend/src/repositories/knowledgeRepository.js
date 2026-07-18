const KnowledgeFile = require('../models/knowledgeFileModel');

class KnowledgeRepository {
  /**
   * Find all files metadata in database sorted by upload date
   */
  async findAll() {
    return KnowledgeFile.find().sort({ uploadDate: -1 });
  }

  /**
   * Find a file metadata by its unique ID
   */
  async findById(id) {
    return KnowledgeFile.findById(id);
  }

  /**
   * Create a new file metadata document in database
   */
  async create(fileData) {
    return KnowledgeFile.create(fileData);
  }

  /**
   * Delete a file metadata document from database
   */
  async delete(id) {
    return KnowledgeFile.findByIdAndDelete(id);
  }
}

module.exports = new KnowledgeRepository();
