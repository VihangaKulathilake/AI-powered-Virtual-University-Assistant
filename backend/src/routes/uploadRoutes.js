const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const upload = require('../uploads/storageConfig');
const { validateFileId } = require('../validators/knowledgeValidator');

// GET /api/knowledge
router.get('/', knowledgeController.getFiles);

// POST /api/knowledge/upload
router.post('/upload', upload.single('file'), knowledgeController.uploadFile);

// GET /api/knowledge/status/:id (Validates ObjectId parameter check)
router.get('/status/:id', validateFileId, knowledgeController.getStatus);

// GET /api/knowledge/:id/chunks (Validates ObjectId parameter check)
router.get('/:id/chunks', validateFileId, knowledgeController.getChunks);

// DELETE /api/knowledge/:id
router.delete('/:id', validateFileId, knowledgeController.deleteFile);

module.exports = router;
