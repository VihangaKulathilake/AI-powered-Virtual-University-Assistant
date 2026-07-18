const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests stub
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routing entry points
app.use('/api/chats', chatRoutes);
app.use('/api/documents', uploadRoutes);

// Catch-all route for unmatched paths
app.use('*', (req, res, next) => {
  const error = new Error(`Cannot find ${req.method} ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler middleware
app.use(errorHandler);

module.exports = app;
