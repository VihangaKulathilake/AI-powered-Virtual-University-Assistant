const pineconeService = require('./pineconeService');

class KnowledgeRetrievalService {
  /**
   * Retrieve the top-N most relevant knowledge chunks from Pinecone using semantic similarity scoped by userId
   * @param {string} query User query text
   * @param {number} limit Maximum number of chunks to return (default 5)
   * @param {string} userId Owner student's MongoDB ID to filter vector results
   * @returns {Promise<string>} Formatted context string ready for AI prompt injection
   */
  async retrieveRelevantChunks(query, limit = 5, userId = null) {
    if (!query || !query.trim()) return '';

    try {
      // 1. Query Pinecone for matches, filtering by userId scope
      const matches = await pineconeService.querySemanticMatches(query, limit, userId);

      if (!matches || matches.length === 0) return '';

      // 2. Format retrieved chunks into a structured context block for the AI prompt
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
