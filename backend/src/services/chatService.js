const chatRepository = require('../repositories/chatRepository');
const aiService = require('./aiService');

class ChatService {
  /**
   * Fetch active chat sessions for user
   */
  async getSessions(userId) {
    return chatRepository.findSessionsByUserId(userId);
  }

  /**
   * Create a new session for user
   */
  async createSession(userId, title) {
    return chatRepository.createSession({ userId, title });
  }

  /**
   * Process a message: save user query, generate AI response, save AI response
   */
  async processMessage(userId, sessionId, messageText) {
    // 1. Fetch chat history context or attachments if needed
    
    // 2. Mock generating response
    const botResponse = await aiService.generateResponse(messageText, []);
    
    // 3. Save messages using repository stubs
    await chatRepository.addMessage(sessionId, { sender: 'user', content: messageText });
    const botMessage = await chatRepository.addMessage(sessionId, { sender: 'assistant', content: botResponse });

    return botMessage;
  }
}

module.exports = new ChatService();
