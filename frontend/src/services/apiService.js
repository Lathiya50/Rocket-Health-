import axios from 'axios';
import { API_CONFIG, HTTP_STATUS } from '../config/constants.js';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handles API errors and returns a standardized error object
   * @param {Object} error - Axios error object
   * @returns {Object} Standardized error object
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data?.message || this.getStatusMessage(status),
        details: data?.data || null,
        isServerError: true
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error. Please check your connection and try again.',
        details: null,
        isNetworkError: true
      };
    } else {
      // Something else happened
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        details: null,
        isUnknownError: true
      };
    }
  }

  /**
   * Gets a user-friendly message for HTTP status codes
   * @param {number} status - HTTP status code
   * @returns {string} User-friendly message
   */
  getStatusMessage(status) {
    const messages = {
      [HTTP_STATUS.BAD_REQUEST]: 'Invalid request. Please check your input.',
      [HTTP_STATUS.UNAUTHORIZED]: 'Authentication required.',
      [HTTP_STATUS.FORBIDDEN]: 'Access denied.',
      [HTTP_STATUS.NOT_FOUND]: 'Resource not found.',
      [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.'
    };
    return messages[status] || 'An error occurred';
  }

  /**
   * Generates a consultation summary
   * @param {Object} data - Summary request data
   * @param {string} data.sessionNotes - Session notes
   * @param {Object} data.preferences - Summary preferences
   * @returns {Promise<Object>} Generated summary response
   */
  async generateSummary(data) {
    const response = await this.client.post(API_CONFIG.ENDPOINTS.GENERATE_SUMMARY, data);
    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
