const Chat = require('../models/chatModel');

class ChatRepository {
  /**
   * Find all chat sessions sorted by last update date
   */
  async findAll() {
    return Chat.find().sort({ updatedAt: -1 });
  }

  /**
   * Find a chat session by its unique ID
   */
  async findById(id) {
    return Chat.findById(id);
  }

  /**
   * Create a new chat session document
   */
  async create(chatData) {
    return Chat.create(chatData);
  }

  /**
   * Delete a chat session document
   */
  async delete(id) {
    return Chat.findByIdAndDelete(id);
  }
}

module.exports = new ChatRepository();
