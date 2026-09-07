const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'ROUTE_NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    logger.warn(`${err.code}: ${err.message}`);
    return res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message } });
  }
  logger.error('Unhandled error', err);
  return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
}

module.exports = { errorHandler, notFoundHandler };
