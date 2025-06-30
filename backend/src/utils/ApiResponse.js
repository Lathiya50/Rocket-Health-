export class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Creates a successful response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Success response object
   */
  static success(data = null, message = 'Operation successful', statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  /**
   * Creates an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Additional error data
   * @returns {Object} Error response object
   */
  static error(message = 'Operation failed', statusCode = 500, data = null) {
    return new ApiResponse(false, message, data, statusCode);
  }

  /**
   * Creates a validation error response
   * @param {string} message - Validation error message
   * @param {Array} errors - Array of validation errors
   * @returns {Object} Validation error response object
   */
  static validationError(message = 'Validation failed', errors = []) {
    return new ApiResponse(false, message, { errors }, 400);
  }

  /**
   * Creates a not found response
   * @param {string} message - Not found message
   * @returns {Object} Not found response object
   */
  static notFound(message = 'Resource not found') {
    return new ApiResponse(false, message, null, 404);
  }

  /**
   * Creates an unauthorized response
   * @param {string} message - Unauthorized message
   * @returns {Object} Unauthorized response object
   */
  static unauthorized(message = 'Unauthorized access') {
    return new ApiResponse(false, message, null, 401);
  }
}
