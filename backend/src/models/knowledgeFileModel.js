const mongoose = require('mongoose');

const KnowledgeFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true,
  },
  storedName: {
    type: String,
    required: [true, 'Stored filename is required'],
    trim: true,
  },
  fileType: {
    type: String,
    required: [true, 'File type mime-type is required'],
  },
  fileSize: {
    type: Number,
    required: [true, 'File size in bytes is required'],
  },
  status: {
    type: String,
    enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'],
    default: 'UPLOADED',
  },
  extractedTextLength: {
    type: Number,
    default: 0,
  },
  processedAt: {
    type: Date,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('KnowledgeFile', KnowledgeFileSchema);
