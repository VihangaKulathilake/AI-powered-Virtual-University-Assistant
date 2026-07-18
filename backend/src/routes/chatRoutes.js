const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateId, validateCreateChat, validateCreateMessage } = require('../validators/chatValidator');

// GET /api/chats and POST /api/chats
router.route('/')
  .get(chatController.getChats)
  .post(validateCreateChat, chatController.createChat);

// GET /api/chats/:id and DELETE /api/chats/:id
router.route('/:id')
  .get(validateId, chatController.getChatById)
  .delete(validateId, chatController.deleteChat);

// GET /api/chats/:id/messages and POST /api/chats/:id/messages
router.route('/:id/messages')
  .get(validateId, chatController.getMessages)
  .post(validateId, validateCreateMessage, chatController.createMessage);

module.exports = router;
