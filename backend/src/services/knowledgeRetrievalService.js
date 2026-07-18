const KnowledgeChunk = require('../models/KnowledgeChunk');

class KnowledgeRetrievalService {
  /**
   * Tokenize a string into lowercase, alphanumeric terms (stop-words filtered)
   * @param {string} text Input string
   * @returns {string[]} Array of terms
   */
  _tokenize(text) {
    const STOP_WORDS = new Set([
      'a', 'an', 'the', 'is', 'in', 'on', 'at', 'to', 'of', 'for', 'and',
      'or', 'but', 'it', 'its', 'this', 'that', 'with', 'as', 'by', 'from',
      'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'can',
      'not', 'no', 'so', 'if', 'about', 'which', 'what', 'how', 'when',
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 1 && !STOP_WORDS.has(term));
  }

  /**
   * Compute a relevance score for a chunk against the query terms using
   * Term Frequency (TF) — counts how many query terms appear in the chunk
   * @param {string} chunkContent Chunk text body
   * @param {string[]} queryTerms Tokenized query terms
   * @returns {number} Relevance score
   */
  _scoreChunk(chunkContent, queryTerms) {
    const chunkTerms = this._tokenize(chunkContent);
    const chunkTermFreq = new Map();

    // Build term frequency map for the chunk
    for (const term of chunkTerms) {
      chunkTermFreq.set(term, (chunkTermFreq.get(term) || 0) + 1);
    }

    let score = 0;
    for (const queryTerm of queryTerms) {
      if (chunkTermFreq.has(queryTerm)) {
        // Boost score by term frequency (TF) in chunk
        score += chunkTermFreq.get(queryTerm);
      }
    }

    // Normalize by chunk length to prevent very long chunks from dominating
    return chunkTerms.length > 0 ? score / Math.sqrt(chunkTerms.length) : 0;
  }

  /**
   * Retrieve the top-N most relevant KnowledgeChunk documents for a given query
   * @param {string} query User query text
   * @param {number} limit Maximum number of chunks to return (default 5)
   * @returns {Promise<string>} Formatted context string ready for AI prompt injection
   */
  async retrieveRelevantChunks(query, limit = 5) {
    if (!query || !query.trim()) return '';

    const queryTerms = this._tokenize(query);
    if (queryTerms.length === 0) return '';

    // Load all available knowledge chunks from MongoDB
    const allChunks = await KnowledgeChunk.find({}).lean();

    if (!allChunks || allChunks.length === 0) return '';

    // Score every chunk against the query
    const scoredChunks = allChunks
      .map(chunk => ({
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        fileId: chunk.fileId,
        score: this._scoreChunk(chunk.content, queryTerms),
      }))
      .filter(chunk => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (scoredChunks.length === 0) return '';

    // Format retrieved chunks into a structured context block for the AI prompt
    const contextParts = scoredChunks.map((chunk, idx) =>
      `[Source ${idx + 1}]\n${chunk.content.trim()}`
    );

    return contextParts.join('\n\n---\n\n');
  }
}

module.exports = new KnowledgeRetrievalService();
