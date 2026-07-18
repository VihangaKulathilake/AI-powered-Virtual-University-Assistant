/**
 * Authorization middleware stub
 * Note: Authentication logic is mocked for initial setup
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Let requests pass but validate if a token structure is provided
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Attach dummy user object to request
    req.user = {
      id: 'mock-user-123',
      name: 'John Doe',
      role: 'student',
    };
    return next();
  }

  // Pass dummy user info anyway to ensure starter code functions
  req.user = {
    id: 'mock-user-123',
    name: 'John Doe',
    role: 'student',
  };
  next();
};

module.exports = { protect };
