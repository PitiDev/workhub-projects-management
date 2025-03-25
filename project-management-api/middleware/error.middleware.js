const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Check if headers are already sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      error: 'Validation error',
      details: errors
    });
  }
  
  // Handle other known errors
  switch (err.name) {
    case 'UnauthorizedError':
      return res.status(401).json({ error: err.message || 'Unauthorized' });
      
    case 'ForbiddenError':
      return res.status(403).json({ error: err.message || 'Forbidden' });
      
    case 'NotFoundError':
      return res.status(404).json({ error: err.message || 'Resource not found' });
      
    case 'BadRequestError':
      return res.status(400).json({ error: err.message || 'Bad request' });
      
    case 'ConflictError':
      return res.status(409).json({ error: err.message || 'Conflict' });
      
    default:
      // For security, don't expose internal server errors in production
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message || 'Internal server error';
      
      return res.status(500).json({ error: message });
  }
};

module.exports = errorMiddleware;