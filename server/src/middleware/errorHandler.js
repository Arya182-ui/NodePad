const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal Server Error';

  logger.error(message, {
    statusCode,
    method: req.method,
    path:   req.path,
    uid:    req.user?.uid,
    stack:  process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
