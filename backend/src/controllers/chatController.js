const chatService = require('../services/chatService');
const messageService = require('../services/messageService');
const { HTTP_STATUS } = require('../constants');

/**
 * Get all chat sessions for the authenticated user
 */
const getChats = async (req, res, next) => {
  try {
    const chats = await chatService.getChats(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new chat session for the authenticated user
 */
const createChat = async (req, res, next) => {
  try {
    const chat = await chatService.createChat(req.body, req.user._id);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific chat session by ID (user-scoped)
 */
const getChatById = async (req, res, next) => {
  try {
    const chat = await chatService.getChatById(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific chat session and its cascade messages (user-scoped)
 */
const deleteChat = async (req, res, next) => {
  try {
    await chatService.deleteChat(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: null,
      message: 'Chat session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all messages in a specific chat session (user-scoped check)
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message to a specific chat session (user-scoped check)
 */
const createMessage = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req.params.id, req.body, req.user._id);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  createChat,
  getChatById,
  deleteChat,
  getMessages,
  createMessage,
};
