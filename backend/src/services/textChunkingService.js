class TextChunkingService {
  /**
   * Split standardized text into paragraph-oriented chunks of 500-800 words
   * @param {string} text Standardized text
   * @returns {Array<{ chunkIndex: number, content: string }>} Array of generated chunk objects
   */
  createChunks(text) {
    if (!text || !text.trim()) return [];

    const chunks = [];
    const MAX_WORDS = 800;

    // Helper helper to count words in string
    const countWords = (str) => {
      if (!str) return 0;
      return str.split(/\s+/).filter(Boolean).length;
    };

    // Split input text by double newline to segment paragraphs
    const paragraphs = text.split('\n\n').map(p => p.trim()).filter(Boolean);

    let currentChunkParagraphs = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const paragraphWordCount = countWords(paragraph);

      // If a single paragraph is larger than the maximum allowed chunk size, split by sentences
      if (paragraphWordCount > MAX_WORDS) {
        // Yield whatever paragraph contents are stored in current chunk first
        if (currentChunkParagraphs.length > 0) {
          chunks.push({
            chunkIndex: chunkIndex++,
            content: currentChunkParagraphs.join('\n\n')
          });
          currentChunkParagraphs = [];
          currentWordCount = 0;
        }

        // Split the heavy paragraph into sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+(\s|$)/g) || [paragraph];
        let sentenceGroup = [];
        let sentenceGroupWordCount = 0;

        for (const sentence of sentences) {
          const sentenceWordCount = countWords(sentence);
          
          if (sentenceGroupWordCount + sentenceWordCount > MAX_WORDS && sentenceGroup.length > 0) {
            chunks.push({
              chunkIndex: chunkIndex++,
              content: sentenceGroup.join(' ').trim()
            });
            sentenceGroup = [];
            sentenceGroupWordCount = 0;
          }
          sentenceGroup.push(sentence);
          sentenceGroupWordCount += sentenceWordCount;
        }

        if (sentenceGroup.length > 0) {
          chunks.push({
            chunkIndex: chunkIndex++,
            content: sentenceGroup.join(' ').trim()
          });
        }
        continue;
      }

      // If grouping this paragraph exceeds the chunk size limit, yield current chunk
      if (currentWordCount + paragraphWordCount > MAX_WORDS && currentChunkParagraphs.length > 0) {
        chunks.push({
          chunkIndex: chunkIndex++,
          content: currentChunkParagraphs.join('\n\n')
        });
        currentChunkParagraphs = [];
        currentWordCount = 0;
      }

      currentChunkParagraphs.push(paragraph);
      currentWordCount += paragraphWordCount;
    }

    // Flush remaining chunk segments
    if (currentChunkParagraphs.length > 0) {
      chunks.push({
        chunkIndex: chunkIndex++,
        content: currentChunkParagraphs.join('\n\n')
      });
    }

    // Strip out blank chunk stubs
    return chunks.filter(chunk => chunk.content && chunk.content.trim().length > 0);
  }
}

module.exports = new TextChunkingService();
