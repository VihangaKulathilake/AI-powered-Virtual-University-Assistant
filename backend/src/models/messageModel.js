const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: [true, 'Chat ID reference is required'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'assistant', 'system'],
      message: '{VALUE} is not a valid message sender role',
    },
    required: [true, 'Message sender role is required'],
  },
  content: {
    type: String,
    required: [true, 'Message content cannot be empty'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Message', MessageSchema);
