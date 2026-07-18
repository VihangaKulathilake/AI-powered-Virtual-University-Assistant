const KnowledgeFile = require('../models/knowledgeFileModel');

class KnowledgeRepository {
  /**
   * Find all files metadata in database uploaded by a specific user
   * @param {string} userId Owner user's MongoDB ID
   */
  async findAll(userId) {
    return KnowledgeFile.find({ userId }).sort({ uploadDate: -1 });
  }

  /**
   * Find a file metadata by ID, scoped to user
   * @param {string} id KnowledgeFile ID
   * @param {string} userId Owner user's MongoDB ID
   */
  async findById(id, userId) {
    return KnowledgeFile.findOne({ _id: id, userId });
  }

  /**
   * Create a new file metadata document in database
   */
  async create(fileData) {
    return KnowledgeFile.create(fileData);
  }

  /**
   * Delete a file metadata document from database
   * @param {string} id KnowledgeFile ID
   * @param {string} userId Owner user's MongoDB ID
   */
  async delete(id, userId) {
    return KnowledgeFile.findOneAndDelete({ _id: id, userId });
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
   * @param {string} userId Owner user's MongoDB ID
   */
  async deleteKnowledgeFile(id, userId) {
    return this.delete(id, userId);
  }
}

module.exports = new KnowledgeRepository();
