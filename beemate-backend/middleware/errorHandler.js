import { log } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  log.error('Unhandled error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    }
  });
};