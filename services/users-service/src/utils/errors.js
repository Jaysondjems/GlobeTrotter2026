class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const NotFoundError = (resource) => new AppError(404, 'RESOURCE_NOT_FOUND', `${resource} not found`);
const ValidationError = (message) => new AppError(400, 'VALIDATION_ERROR', message);
const ConflictError = (message) => new AppError(409, 'CONFLICT', message);
const UnauthorizedError = (message = 'Unauthorized') => new AppError(401, 'UNAUTHORIZED', message);

module.exports = { AppError, NotFoundError, ValidationError, ConflictError, UnauthorizedError };
