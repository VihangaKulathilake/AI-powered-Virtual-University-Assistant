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

  /**
   * Update the pipeline processing status of a knowledge file
   * @param {string} id KnowledgeFile ID
   * @param {'UPLOADED'|'PROCESSING'|'READY'|'FAILED'} status Status string
   */
  async updateProcessingStatus(id, status) {
    return KnowledgeFile.findByIdAndUpdate(id, { status }, { new: true });
  }

  /**
   * Update the extracted text character length of a knowledge file
   * @param {string} id KnowledgeFile ID
   * @param {number} length Character length
   */
  async updateExtractedTextLength(id, length) {
    return KnowledgeFile.findByIdAndUpdate(id, { extractedTextLength: length }, { new: true });
  }

  /**
   * Delete metadata record for knowledge file
   * @param {string} id KnowledgeFile ID
   */
  async deleteKnowledgeFile(id) {
    return this.delete(id);
  }
}

module.exports = new KnowledgeRepository();
