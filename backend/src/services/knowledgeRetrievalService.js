const pineconeService = require('./pineconeService');
const KnowledgeFile = require('../models/knowledgeFileModel');

class KnowledgeRetrievalService {
  /**
   * Retrieve the top-N most relevant knowledge chunks from Pinecone using semantic similarity.
   * Restricts search focus specifically to the most recently uploaded READY document of the user.
   *
   * @param {string} query User query text
   * @param {number} limit Maximum number of chunks to return (default 5)
   * @param {string} userId Owner student's MongoDB ID to filter vector results
   * @returns {Promise<string>} Formatted context string ready for AI prompt injection
   */
  async retrieveRelevantChunks(query, limit = 5, userId = null) {
    if (!query || !query.trim()) return '';

    try {
      let latestFileId = null;

      if (userId) {
        // Find the most recently uploaded READY document for this specific student
        const latestFile = await KnowledgeFile.findOne({ userId, status: 'READY' })
          .sort({ uploadDate: -1 });
        
        if (latestFile) {
          latestFileId = latestFile._id;
          console.log(`[RAG Retrieval] Isolating search context to the latest document: "${latestFile.originalName}" (${latestFileId})`);
        }
      }

      // Query Pinecone for matches, filtering by userId and isolating to the latestFileId scope
      const matches = await pineconeService.querySemanticMatches(query, limit, userId, latestFileId);

      if (!matches || matches.length === 0) return '';

      // Format retrieved chunks into a structured context block for the AI prompt
      const contextParts = matches.map((match, idx) =>
        `[Source ${idx + 1}: ${match.fileName}]\n${match.text.trim()}`
      );

      return contextParts.join('\n\n---\n\n');
    } catch (err) {
      console.error(`[KnowledgeRetrievalService] Semantic search failure: ${err.message}`);
      // Fallback gracefully on search failure to keep conversation pipeline alive (no context)
      return '';
    }
  }
}

module.exports = new KnowledgeRetrievalService();
