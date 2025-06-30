// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  ENDPOINTS: {
    GENERATE_SUMMARY: '/api/generate-summary'
  },
  TIMEOUT: 300000, // 3 min
};

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Summary preferences options
export const SUMMARY_OPTIONS = {
  TONE: {
    CLINICAL: 'clinical',
    EMPATHETIC: 'empathetic',
    NEUTRAL: 'neutral'
  },
  SESSION_TYPE: {
    THERAPY: 'therapy',
    PSYCHIATRY: 'psychiatry',
    COUPLES: 'couples',
    SEXUAL_HEALTH: 'sexual-health'
  },
  SUMMARY_LENGTH: {
    SHORT: 'short',
    MEDIUM: 'medium',
    DETAILED: 'detailed'
  }
};

// Validation constants
export const VALIDATION = {
  SESSION_NOTES: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10000
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  SESSION_NOTES: 'rocket_health_session_notes',
  PREFERENCES: 'rocket_health_preferences',
  LAST_SUMMARY: 'rocket_health_last_summary'
};
