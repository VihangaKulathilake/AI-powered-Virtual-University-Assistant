const chatRepository = require('../repositories/chatRepository');
const messageRepository = require('../repositories/messageRepository');

class ChatService {
  /**
   * Fetch all active chat sessions
   */
  async getChats() {
    return chatRepository.findAll();
  }

  /**
   * Retrieve a specific chat session by ID
   */
  async getChatById(id) {
    const chat = await chatRepository.findById(id);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return chat;
  }

  /**
   * Initialize a new chat session
   */
  async createChat(chatData) {
    const title = chatData.title && chatData.title.trim() ? chatData.title.trim() : 'New Chat';
    return chatRepository.create({ title });
  }

  /**
   * Delete a chat session and all messages associated with it
   */
  async deleteChat(id) {
    const chat = await chatRepository.findById(id);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    // Cascade delete all message documents linked to this chat ID
    await messageRepository.deleteByChatId(id);

    // Remove the chat session itself
    return chatRepository.delete(id);
  }
}

module.exports = new ChatService();
