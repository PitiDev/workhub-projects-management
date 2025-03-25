// utils/catchAsync.js

/**
 * Wraps an async function and forwards any errors to Express error handler
 * This eliminates the need for try/catch blocks in controller methods
 *
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
module.exports = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };