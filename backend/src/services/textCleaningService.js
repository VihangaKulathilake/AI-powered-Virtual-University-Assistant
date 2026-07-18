class TextCleaningService {
  /**
   * Clean raw extracted text by normalizing spaces and conserving paragraph blocks
   * @param {string} text Raw string payload
   * @returns {string} Standardized text output
   */
  cleanText(text) {
    if (!text) return '';

    // 1. Normalize line breaks (Windows/Mac CR/CRLF -> standard LF newlines)
    let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 2. Clear control characters/invalid non-printable ascii (retains tabs, spaces, newlines)
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    // 3. Consolidate multiple inline spaces and tabs into a single space
    cleaned = cleaned.replace(/[ \t]+/g, ' ');

    // 4. Consolidate excessive empty lines (3 or more newlines) into exactly two newlines
    // This preserves logical paragraph splits while removing document margins whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // 5. Clean up outer trailing spaces
    return cleaned.trim();
  }
}

module.exports = new TextCleaningService();
