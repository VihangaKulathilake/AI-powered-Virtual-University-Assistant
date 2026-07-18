const https = require('https');

class EmbeddingService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[Embedding Service] WARNING: GEMINI_API_KEY is not configured.');
    }
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = 'gemini-embedding-001'; // 3072-dimensional embeddings
  }

  /**
   * Generates a 3072-dimensional vector embedding for the given text using the Gemini REST API.
   * @param {string} text Input text chunk
   * @returns {Promise<number[]>} Array of floats representing the embedding vector
   */
  generateEmbedding(text) {
    if (!text || !text.trim()) {
      return Promise.reject(new Error('Cannot generate embedding for empty text.'));
    }

    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        content: { parts: [{ text: text.trim() }] },
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${this.modelName}:embedContent?key=${this.apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.embedding && json.embedding.values) {
              resolve(json.embedding.values);
            } else {
              reject(new Error(`Gemini embedding API error: ${JSON.stringify(json).slice(0, 200)}`));
            }
          } catch (err) {
            reject(new Error(`Failed to parse Gemini embedding response: ${err.message}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(new Error(`Embedding HTTP request failed: ${err.message}`));
      });

      req.write(body);
      req.end();
    });
  }

  /**
   * Batch generate embeddings for multiple text chunks.
   * @param {string[]} texts Array of text chunks
   * @returns {Promise<number[][]>} Array of embedding vector arrays
   */
  async generateEmbeddingsBatch(texts = []) {
    return Promise.all(texts.map((text) => this.generateEmbedding(text)));
  }
}

module.exports = new EmbeddingService();
