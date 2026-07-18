const { HTTP_STATUS } = require('../constants');

/**
 * @desc    Get all chat sessions
 * @route   GET /api/chats/sessions
 * @access  Private
 */
const getSessions = async (req, res, next) => {
  try {
    const mockSessions = [
      {
        id: 'session-1',
        title: 'Introduction to Calculus I',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messagesCount: 2,
      },
      {
        id: 'session-2',
        title: 'Database Normalization Help',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        messagesCount: 4,
      }
    ];

    res.status(HTTP_STATUS.OK).json(mockSessions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new chat session
 * @route   POST /api/chats/sessions
 * @access  Private
 */
const createSession = async (req, res, next) => {
  try {
    const { title } = req.body;
    const newSession = {
      id: `session-${Date.now()}`,
      title: title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messagesCount: 0,
    };

    res.status(HTTP_STATUS.CREATED).json(newSession);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get messages inside a session
 * @route   GET /api/chats/sessions/:sessionId/messages
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const mockMessages = [
      {
        id: 'msg-1',
        sender: 'assistant',
        content: `Welcome to conversation session ${sessionId}. Ask me any questions!`,
        timestamp: new Date().toISOString(),
      }
    ];

    res.status(HTTP_STATUS.OK).json(mockMessages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message to a session
 * @route   POST /api/chats/sessions/:sessionId/messages
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.CREATED).json(userMsg);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a chat session
 * @route   DELETE /api/chats/sessions/:sessionId
 * @access  Private
 */
const deleteSession = async (req, res, next) => {
  try {
    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  createSession,
  getMessages,
  sendMessage,
  deleteSession,
};
