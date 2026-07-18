const Chat = require('../models/chatModel');

class ChatRepository {
  /**
   * Find all chat sessions for a specific user, sorted by last update
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async findAll(userId) {
    return Chat.find({ userId }).sort({ updatedAt: -1 });
  }

  /**
   * Find a chat session by ID, scoped to a specific user
   * @param {string} id Chat session _id
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async findById(id, userId) {
    return Chat.findOne({ _id: id, userId });
  }

  /**
   * Create a new chat session owned by a user
   * @param {object} chatData Must include { title, userId }
   */
  async create(chatData) {
    return Chat.create(chatData);
  }

  /**
   * Delete a chat session owned by a specific user
   * @param {string} id Chat session _id
   * @param {string} userId Authenticated user's MongoDB _id
   */
  async delete(id, userId) {
    return Chat.findOneAndDelete({ _id: id, userId });
  }
}

module.exports = new ChatRepository();
