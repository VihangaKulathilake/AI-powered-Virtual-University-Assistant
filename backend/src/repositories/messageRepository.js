const Message = require('../models/messageModel');

class MessageRepository {
  /**
   * Get all messages in a specific chat session ordered by creation time
   */
  async findByChatId(chatId) {
    return Message.find({ chatId }).sort({ createdAt: 1 });
  }

  /**
   * Save a message document to MongoDB
   */
  async create(messageData) {
    return Message.create(messageData);
  }

  /**
   * Delete all messages referencing a specific chat session
   */
  async deleteByChatId(chatId) {
    return Message.deleteMany({ chatId });
  }
}

module.exports = new MessageRepository();
