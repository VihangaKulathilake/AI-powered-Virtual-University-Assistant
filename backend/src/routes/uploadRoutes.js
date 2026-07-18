const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const upload = require('../uploads/storageConfig');
const { validateFileId } = require('../validators/knowledgeValidator');

// GET /api/knowledge
router.get('/', knowledgeController.getFiles);

// POST /api/knowledge/upload (Binds Multer upload middleware for single file key 'file')
router.post('/upload', upload.single('file'), knowledgeController.uploadFile);

// DELETE /api/knowledge/:id (Validates ObjectId parameter check)
router.delete('/:id', validateFileId, knowledgeController.deleteFile);

module.exports = router;
