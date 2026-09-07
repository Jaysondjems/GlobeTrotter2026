class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const NotFoundError = (resource) => new AppError(404, 'RESOURCE_NOT_FOUND', `${resource} not found`);
const ServiceUnavailableError = (message) => new AppError(503, 'SERVICE_UNAVAILABLE', message);

module.exports = { AppError, NotFoundError, ServiceUnavailableError };
