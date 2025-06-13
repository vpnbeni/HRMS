const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired (2 hours)
    const tokenExp = verified.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    if (now >= tokenExp) {
      return res.status(401).json({ message: 'Token expired' });
    }

    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = auth; 