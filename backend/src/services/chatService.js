const chatRepository = require('../repositories/chatRepository');
const messageRepository = require('../repositories/messageRepository');

class ChatService {
  /**
   * Fetch all chat sessions for a specific user
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async getChats(userId) {
    return chatRepository.findAll(userId);
  }

  /**
   * Retrieve a specific chat session by ID, scoped to user
   * @param {string} id Chat session _id
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async getChatById(id, userId) {
    const chat = await chatRepository.findById(id, userId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return chat;
  }

  /**
   * Initialize a new chat session owned by a user
   * @param {object} chatData { title }
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async createChat(chatData, userId) {
    const title = chatData.title && chatData.title.trim() ? chatData.title.trim() : 'New Chat';
    return chatRepository.create({ title, userId });
  }

  /**
   * Delete a chat session and all messages associated with it
   * @param {string} id Chat session _id
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async deleteChat(id, userId) {
    const chat = await chatRepository.findById(id, userId);
    if (!chat) {
      const error = new Error(`Chat session not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    // Cascade delete all message documents linked to this chat ID
    await messageRepository.deleteByChatId(id);

    // Remove the chat session itself
    return chatRepository.delete(id, userId);
  }
}

module.exports = new ChatService();
