const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  attachments: [{
    name: String,
    size: Number,
    fileType: String,
    url: String,
  }],
});

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'New Chat Session',
  },
  messages: [MessageSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
module.exports.MessageSchema = MessageSchema;
