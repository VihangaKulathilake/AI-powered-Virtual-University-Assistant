const embeddingService = require('./embeddingService');
const { v4: uuidv4 } = require('uuid');

class PineconeService {
  constructor() {
    this.pc = null;
    this.index = null;
    this.indexName = process.env.PINECONE_INDEX || 'uniassist';
  }

  /**
   * Lazily initialize the Pinecone client to prevent startup crashes when keys are missing.
   * @private
   */
  _ensureInit() {
    if (this.index) return;

    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey || apiKey.startsWith('your_')) {
      throw new Error('Pinecone API Key is not set in backend/.env file. Please check PINECONE_API_KEY.');
    }

    try {
      const { Pinecone } = require('@pinecone-database/pinecone');
      this.pc = new Pinecone({ apiKey });
      this.index = this.pc.index(this.indexName);
      console.log(`[Pinecone Service] Connection initialized for index: "${this.indexName}"`);
    } catch (err) {
      console.error(`[Pinecone Service] Initialization error: ${err.message}`);
      throw new Error(`Failed to initialize Pinecone Client: ${err.message}`);
    }
  }

  /**
   * Embed a batch of text chunks and upsert them as vectors into Pinecone
   * @param {Array<{content: string, chunkIndex: number}>} chunks Split document text chunks
   * @param {string} fileId MongoDB file ID reference
   * @param {string} fileName Original document filename
   * @param {string} userId Owner student's MongoDB user ID
   * @returns {Promise<Array<object>>} Metadata array representing saved chunk structures
   */
  async upsertDocumentChunks(chunks = [], fileId, fileName, userId) {
    if (!chunks || chunks.length === 0) return [];
    
    this._ensureInit();

    try {
      console.log(`[Pinecone Service] Vectorizing and uploading ${chunks.length} chunks for: "${fileName}" (User: ${userId})`);
      
      const upsertVectors = [];
      const chunkMetadataRecords = [];

      for (const chunk of chunks) {
        // Generate the 3072-dimensional embedding vector via Gemini
        const embeddingValues = await embeddingService.generateEmbedding(chunk.content);

        // Generate a unique ID for this vector
        const vectorId = uuidv4();

        upsertVectors.push({
          id: vectorId,
          values: embeddingValues,
          metadata: {
            text: chunk.content,
            fileId: fileId.toString(),
            fileName: fileName,
            chunkIndex: chunk.chunkIndex,
            userId: userId ? userId.toString() : 'system', // Store owner scope in vector metadata
          },
        });

        // Track metadata records to optionally return to MongoDB
        chunkMetadataRecords.push({
          vectorId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
        });
      }

      // Upload batches of vectors to Pinecone
      await this.index.upsert(upsertVectors);
      console.log(`[Pinecone Service] Successfully upserted ${upsertVectors.length} vectors for file: "${fileName}"`);

      return chunkMetadataRecords;
    } catch (err) {
      console.error(`[Pinecone Service] Upsert failure: ${err.message}`);
      throw err;
    }
  }

  /**
   * Search Pinecone for chunks semantically similar to the input user query
   * @param {string} query User query string
   * @param {number} limit Maximum matches to return (default 5)
   * @param {string} userId Owner student's user ID for semantic search scoping
   * @param {string} fileId Optional specific document ID to isolate search focus
   * @returns {Promise<Array<{text: string, score: number, fileName: string}>>} Array of matched chunks
   */
  async querySemanticMatches(query, limit = 5, userId = null, fileId = null) {
    if (!query || !query.trim()) return [];

    this._ensureInit();

    try {
      // 1. Convert user search query to vector embedding
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      // 2. Build query parameters with metadata filtering by userId and fileId
      const queryOptions = {
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
      };

      const filter = {};
      if (userId) {
        filter.userId = { $eq: userId.toString() };
      }
      if (fileId) {
        filter.fileId = { $eq: fileId.toString() };
      }

      if (Object.keys(filter).length > 0) {
        queryOptions.filter = filter;
      }

      // 3. Query Pinecone
      const queryResponse = await this.index.query(queryOptions);

      if (!queryResponse || !queryResponse.matches) {
        return [];
      }

      // 4. Map matches to clean response blocks
      return queryResponse.matches.map(match => ({
        text: match.metadata ? match.metadata.text : '',
        score: match.score || 0,
        fileName: match.metadata ? match.metadata.fileName : 'Unknown Document',
        fileId: match.metadata ? match.metadata.fileId : null,
      })).filter(item => item.text.trim().length > 0);
      
    } catch (err) {
      console.error(`[Pinecone Service] Query failure: ${err.message}`);
      // Fallback gracefully on query error to let the conversation continue (without context)
      return [];
    }
  }

  /**
   * Remove all vectors associated with a deleted fileId from Pinecone
   * @param {string} fileId MongoDB file ID to delete
   */
  async deleteFileVectors(fileId) {
    if (!fileId) return;

    try {
      this._ensureInit();
      console.log(`[Pinecone Service] Deleting vectors with fileId: "${fileId}"`);
      
      await this.index.deleteMany({
        filter: {
          fileId: { $eq: fileId.toString() },
        },
      });
      
      console.log(`[Pinecone Service] Successfully deleted vectors for fileId: "${fileId}"`);
    } catch (err) {
      console.error(`[Pinecone Service] Delete failure: ${err.message}`);
      // Log error but do not block cascading operations
    }
  }

  /**
   * Deletes all profile and system testing vectors that were uploaded during test scripts
   */
  async cleanProfileVectors() {
    this._ensureInit();
    try {
      console.log('[Pinecone Service] Removing student profile vectors...');
      await this.index.deleteMany({
        filter: {
          source: { $eq: 'student-profile' },
        },
      });
      console.log('[Pinecone Service] Student profile vectors cleared.');
    } catch (err) {
      console.warn(`[Pinecone Service] Cleanup warning: ${err.message}`);
    }
  }
}

module.exports = new PineconeService();
