const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    // Check session version
    if (decoded.sessionVersion !== undefined && decoded.sessionVersion !== req.admin.sessionVersion) {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Not authorized, session expired or invalid' });
  }
};

module.exports = authMiddleware;
