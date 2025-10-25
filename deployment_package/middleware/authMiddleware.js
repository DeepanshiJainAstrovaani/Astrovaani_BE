const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    // Verify token logic here
    next();
  };
  
  module.exports = authMiddleware;