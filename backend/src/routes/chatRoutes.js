const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Get all active sessions and create a new session
router.route('/sessions')
  .get(protect, chatController.getSessions)
  .post(protect, chatController.createSession);

// Get messages and post message to a specific session
router.route('/sessions/:sessionId/messages')
  .get(protect, chatController.getMessages)
  .post(protect, chatController.sendMessage);

// Delete a conversation session
router.route('/sessions/:sessionId')
  .delete(protect, chatController.deleteSession);

module.exports = router;
