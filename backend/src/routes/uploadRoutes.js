const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Post document uploads for index processing
router.post('/upload', protect, uploadController.uploadDocument);

module.exports = router;
