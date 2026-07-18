const mongoose = require('mongoose');

const KnowledgeFileSchema = new mongoose.Schema({
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
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('KnowledgeFile', KnowledgeFileSchema);
