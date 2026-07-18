const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for fast per-user queries
  },
  title: {
    type: String,
    required: [true, 'Chat title is required'],
    trim: true,
  }
}, {
  timestamps: true, // Auto adds createdAt and updatedAt
});

module.exports = mongoose.model('Chat', ChatSchema);
