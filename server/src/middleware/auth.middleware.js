const { admin } = require('../config/firebase');
const logger    = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token   = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    logger.warn('Auth failed', { message: err.message });
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
