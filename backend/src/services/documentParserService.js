const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class DocumentParserService {
  /**
   * Parse uploaded documents from disk and extract raw string contents
   * @param {string} filePath Absolute path of target file on disk
   * @param {string} fileType MIME type string (e.g. application/pdf)
   * @returns {Promise<{ success: boolean, text: string }>} Extracted text payload
   */
  async parseDocument(filePath, fileType) {
    try {
      // Check if file is accessible
      await fs.access(filePath);
      
      // Load file into memory buffer
      const fileBuffer = await fs.readFile(filePath);

      if (!fileBuffer || fileBuffer.length === 0) {
        const error = new Error('Empty document: File contains no data contents');
        error.statusCode = 400;
        throw error;
      }

      let text = '';
      const normalizedType = fileType.toLowerCase();

      // Orchestrate parsers based on types
      if (normalizedType.includes('pdf')) {
        const parsedPdf = await pdfParse(fileBuffer);
        text = parsedPdf.text;
      } else if (normalizedType.includes('officedocument.wordprocessingml.document') || filePath.endsWith('.docx')) {
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        text = docxResult.value;
      } else if (normalizedType.includes('text/plain') || filePath.endsWith('.txt')) {
        text = fileBuffer.toString('utf8');
      } else {
        const error = new Error(`Unsupported resource type: ${fileType}. Only PDF, DOCX, and TXT are supported.`);
        error.statusCode = 400;
        throw error;
      }

      // Check if parsed content is blank
      if (!text || !text.trim()) {
        const error = new Error('No extractable text content found inside the uploaded file.');
        error.statusCode = 400;
        throw error;
      }

      return {
        success: true,
        text: text,
      };
    } catch (err) {
      if (err.statusCode) throw err;
      
      // Trap standard parsing errors (corrupted formats, Mammoth parse failures)
      const error = new Error(`Document parsing operation failed: ${err.message}`);
      error.statusCode = 500;
      throw error;
    }
  }
}

module.exports = new DocumentParserService();
