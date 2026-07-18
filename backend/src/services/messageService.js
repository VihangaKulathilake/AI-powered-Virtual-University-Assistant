const messageRepository = require('../repositories/messageRepository');
const chatRepository = require('../repositories/chatRepository');

class MessageService {
  /**
   * Get all messages in a specific chat session
   */
  async getMessages(chatId) {
    const chat = await chatRepository.findById(chatId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${chatId}`);
      error.statusCode = 404;
      throw error;
    }
    return messageRepository.findByChatId(chatId);
  }

  /**
   * Save a user message and automatically save a template AI reply to the database
   */
  async createMessage(chatId, messageData) {
    const chat = await chatRepository.findById(chatId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${chatId}`);
      error.statusCode = 404;
      throw error;
    }

    // 1. Create and save user query message
    const userMsg = await messageRepository.create({
      chatId,
      role: 'user',
      content: messageData.content,
    });

    // 2. Auto-generate and save a placeholder assistant response to Mongoose
    await messageRepository.create({
      chatId,
      role: 'assistant',
      content: `I received your coursework query: **"${messageData.content}"**.\n\nThe Gemini/OpenAI integration will process your uploaded files and provide a customized response here. REST APIs are fully ready.`,
    });

    return userMsg;
  }
}

module.exports = new MessageService();
