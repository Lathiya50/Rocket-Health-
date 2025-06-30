export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'ApiError';

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a bad request error (400)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static badRequest(message = 'Bad Request') {
    return new ApiError(400, message);
  }

  /**
   * Creates an unauthorized error (401)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /**
   * Creates a forbidden error (403)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /**
   * Creates a not found error (404)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static notFound(message = 'Not Found') {
    return new ApiError(404, message);
  }

  /**
   * Creates a too many requests error (429)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static tooManyRequests(message = 'Too Many Requests') {
    return new ApiError(429, message);
  }

  /**
   * Creates an internal server error (500)
   * @param {string} message - Error message
   * @returns {ApiError} ApiError instance
   */
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}
