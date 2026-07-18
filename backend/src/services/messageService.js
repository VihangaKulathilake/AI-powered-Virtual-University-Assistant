const messageRepository = require('../repositories/messageRepository');
const chatRepository = require('../repositories/chatRepository');
const knowledgeRetrievalService = require('./knowledgeRetrievalService');
const aiService = require('./aiService');

class MessageService {
  /**
   * Get all messages in a specific chat session, scoped to a user
   * @param {string} chatId Chat session ID
   * @param {string} userId Owner student user ID
   */
  async getMessages(chatId, userId) {
    const chat = await chatRepository.findById(chatId, userId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${chatId}`);
      error.statusCode = 404;
      throw error;
    }
    return messageRepository.findByChatId(chatId);
  }

  /**
   * Save a user message, generate a real AI response, and persist both to MongoDB
   * @param {string} chatId Target chat session ID
   * @param {object} messageData Object containing { content }
   * @param {string} userId Owner student user ID
   * @returns {Promise<object>} The saved user message document
   */
  async createMessage(chatId, messageData, userId) {
    // Verify chat session exists and is owned by this user
    const chat = await chatRepository.findById(chatId, userId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${chatId}`);
      error.statusCode = 404;
      throw error;
    }

    // Step 1: Save the user message to MongoDB
    const userMsg = await messageRepository.create({
      chatId,
      role: 'user',
      content: messageData.content,
    });

    // Step 2: Load the full conversation history for multi-turn context
    const history = await messageRepository.findByChatId(chatId);
    const previousMessages = history.filter(
      msg => msg._id.toString() !== userMsg._id.toString()
    );

    // Step 3: Retrieve relevant knowledge chunks via semantic Pinecone search, filtered by userId
    const knowledgeContext = await knowledgeRetrievalService.retrieveRelevantChunks(
      messageData.content,
      5,
      userId
    );

    // Step 4: Generate a real AI response using Gemini with context
    const aiResponseText = await aiService.generateResponse(
      messageData.content,
      previousMessages,
      knowledgeContext
    );

    // Step 5: Save the AI-generated assistant reply to MongoDB
    await messageRepository.create({
      chatId,
      role: 'assistant',
      content: aiResponseText,
    });

    return userMsg;
  }
}

module.exports = new MessageService();
