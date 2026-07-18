const { GoogleGenerativeAI } = require('@google/generative-ai');
const systemPromptService = require('./systemPromptService');

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[AI Service] WARNING: GEMINI_API_KEY is not set. AI responses will fail.');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.modelName = 'gemini-2.5-flash';
  }

  /**
   * Map stored message documents to the format Gemini multi-turn chat expects.
   * Gemini uses 'user' and 'model' roles (not 'assistant').
   * @param {Array<object>} messageHistory Array of Message documents from MongoDB
   * @returns {Array<{role: string, parts: [{text: string}]}>}
   */
  _buildChatHistory(messageHistory = []) {
    return messageHistory
      .filter(msg => {
        const role = msg.role || msg.sender;
        return role === 'user' || role === 'assistant';
      })
      .map(msg => {
        const role = msg.role || msg.sender;
        return {
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        };
      });
  }

  /**
   * Generate an AI response using Gemini with:
   * - Injected system prompt (university persona + guidelines)
   * - RAG knowledge context from uploaded documents
   * - Full multi-turn conversation history
   * - Optional multimodal image attachment
   *
   * @param {string} userMessage The latest user query
   * @param {Array<object>} chatHistory Previous messages from MongoDB
   * @param {string} knowledgeContext Formatted context from KnowledgeRetrievalService
   * @param {object} image Optional image attachment { data: string, mimeType: string }
   * @returns {Promise<string>} AI-generated response text
   */
  async generateResponse(userMessage, chatHistory = [], knowledgeContext = '', image = null) {
    try {
      // Build the system prompt with university persona + knowledge context
      const systemPrompt = systemPromptService.buildSystemPrompt(knowledgeContext);

      // Initialize Gemini model with system instruction
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.7,       // Balanced creativity vs. accuracy
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      // Build Gemini-compatible multi-turn history (exclude the current message)
      const history = this._buildChatHistory(chatHistory);

      let text;
      
      // If an image is attached, bypass chat.sendMessage to ensure model parses inlineData correctly
      if (image && image.data && image.mimeType) {
        const contents = [];
        
        // 1. Build conversation history
        for (const msg of chatHistory) {
          const role = msg.role || msg.sender;
          contents.push({
            role: role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
        
        // 2. Add current message with image parts
        contents.push({
          role: 'user',
          parts: [
            { text: userMessage || 'Explain the attached screenshot.' },
            {
              inlineData: {
                data: image.data,
                mimeType: image.mimeType,
              },
            },
          ],
        });

        const result = await model.generateContent({ contents });
        text = result.response.text();
      } else {
        // Fallback to stateful chat session for text-only queries
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        text = result.response.text();
      }

      if (!text || !text.trim()) {
        throw new Error('Gemini returned an empty response.');
      }

      return text.trim();
    } catch (err) {
      console.error(`[AI Service] Gemini generation error: ${err.message}`);

      let errorMessage = err.message;
      if (
        err.message.includes('Quota exceeded') || 
        err.message.includes('quota') ||
        err.message.includes('429') || 
        err.message.includes('ResourceExhausted') ||
        err.message.includes('limit')
      ) {
        errorMessage = 'Google Gemini API quota limit exceeded. You have reached the maximum requests limit for your API key. Please wait a few minutes, check your Google AI Studio quota allocations, or try again later.';
      } else {
        errorMessage = `AI generation failed: ${err.message}`;
      }

      // Surface a clean error to the caller instead of crashing silently
      const error = new Error(errorMessage);
      error.statusCode = 503;
      throw error;
    }
  }

  /**
   * Generate a concise summary of an uploaded document's extracted text.
   * @param {string} text Extracted document text
   * @returns {Promise<string>} Summary text
   */
  async summarizeDocument(text) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
      });

      const prompt = `Summarize the following university document in 3-5 concise bullet points:\n\n${text.slice(0, 4000)}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.error(`[AI Service] Summarization error: ${err.message}`);
      return 'Summary could not be generated at this time.';
    }
  }
}

module.exports = new AIService();
