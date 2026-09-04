const { error } = require('../utils/response');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === 'ValidationError') {
    return error(res, err.message, 400, err.errors);
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error. Please try again later.'
    : err.message || 'Internal server error';

  return error(res, message, statusCode);
};

module.exports = {
  errorHandler,
};
