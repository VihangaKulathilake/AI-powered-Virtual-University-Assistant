require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database stub (not invoked or handles failures gracefully)
// Note: connection logic is stubbed out per guidelines
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database connection:', err.message);
    // Even if db connection fails or is not configged, allow server to run for starter structure tests
    app.listen(PORT, () => {
      console.log(`Server running (without database) on port ${PORT}`);
    });
  });
