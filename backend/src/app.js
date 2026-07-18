const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows static uploads access in development
}));

// Cross Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));

// HTTP Request Logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// JSON Body Parser with elevated limits for multimodal image payloads (Base64)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Serve Uploads folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'System Health Check OK',
    timestamp: new Date(),
  });
});

// REST API Route mappings
// Auth routes — public (no JWT required)
app.use('/api/auth', authRoutes);

// Chat and Knowledge routes — protected (JWT required)
app.use('/api/chats', protect, chatRoutes);
app.use('/api/knowledge', protect, uploadRoutes);

// Catch-all route for unmatched paths (404)
app.use('*', (req, res, next) => {
  const error = new Error(`Cannot find ${req.method} ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error handling middleware
app.use(errorHandler);

module.exports = app;
