const KnowledgeChunk = require('../models/KnowledgeChunk');

class ChunkRepository {
  /**
   * Save a single chunk document to database
   * @param {object} chunkData Chunk metadata and content
   */
  async createChunk(chunkData) {
    return KnowledgeChunk.create(chunkData);
  }

  /**
   * Bulk insert an array of chunk documents into MongoDB (high efficiency)
   * @param {Array<object>} chunksArray Array of chunks to save
   */
  async createManyChunks(chunksArray) {
    return KnowledgeChunk.insertMany(chunksArray);
  }

  /**
   * Find all chunks associated with a specific KnowledgeFile sorted by index
   * @param {string} fileId KnowledgeFile ObjectId
   */
  async findByFileId(fileId) {
    return KnowledgeChunk.find({ fileId }).sort({ chunkIndex: 1 });
  }

  /**
   * Delete all chunks associated with a specific KnowledgeFile
   * @param {string} fileId KnowledgeFile ObjectId
   */
  async deleteByFileId(fileId) {
    return KnowledgeChunk.deleteMany({ fileId });
  }
}

module.exports = new ChunkRepository();
