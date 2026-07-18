const mongoose = require('mongoose');

const KnowledgeChunkSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeFile',
    required: [true, 'KnowledgeFile reference is required'],
  },
  chunkIndex: {
    type: Number,
    required: [true, 'Chunk index number is required'],
  },
  content: {
    type: String,
    required: [true, 'Chunk content text is required'],
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('KnowledgeChunk', KnowledgeChunkSchema);
