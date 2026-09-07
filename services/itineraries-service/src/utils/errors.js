class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const NotFoundError = (resource) => new AppError(404, 'RESOURCE_NOT_FOUND', `${resource} not found`);
const ValidationError = (message) => new AppError(400, 'VALIDATION_ERROR', message);
const UnauthorizedError = (message = 'Unauthorized') => new AppError(401, 'UNAUTHORIZED', message);
const ServiceUnavailableError = (message) => new AppError(503, 'SERVICE_UNAVAILABLE', message);

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError, ServiceUnavailableError };
