const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chat title is required'],
    trim: true,
  }
}, {
  timestamps: true, // Auto adds createdAt and updatedAt
});

module.exports = mongoose.model('Chat', ChatSchema);
