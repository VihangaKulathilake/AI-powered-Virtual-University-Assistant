const path = require('path');

/**
 * Storage configuration constants for the uploads directory
 */
const uploadDirectoryConfig = {
  // Resolved absolute path to directory storage
  uploadDir: __dirname,
  
  // Default storage path for incoming coursework files
  defaultStoragePath: path.resolve(__dirname),

  // File structure info helper
  getUploadPath: (filename) => {
    return path.join(__dirname, filename);
  }
};

module.exports = uploadDirectoryConfig;
