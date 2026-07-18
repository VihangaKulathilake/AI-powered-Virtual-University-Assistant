const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname);

// Ensure local uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Multer local disk storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename using UUID v4 to prevent collision
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${fileExt}`);
  }
});

/**
 * Filter allowed file extensions and MIME types
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.txt', '.docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isAllowedExt = allowedExtensions.includes(ext);
  const isAllowedMime = allowedMimeTypes.includes(mime);

  if (isAllowedExt && isAllowedMime) {
    cb(null, true);
  } else {
    // Throw client error immediately to halt upload pipeline
    const error = new Error('Invalid file type. Only PDF, TXT, and DOCX documents are allowed.');
    error.statusCode = 400;
    cb(error, false);
  }
};

/**
 * Multer middleware instance
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size limit
  }
});

module.exports = upload;
