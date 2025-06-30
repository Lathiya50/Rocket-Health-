import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode)
    );
  }

  // Handle OpenAI specific errors
  if (err.name === 'OpenAIError') {
    return res.status(500).json(
      ApiResponse.error('AI service temporarily unavailable. Please try again later.', 500)
    );
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(
      ApiResponse.error(err.message, 400)
    );
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(
      ApiResponse.error('Invalid JSON in request body', 400)
    );
  }

  // Handle rate limit errors
  if (err.status === 429) {
    return res.status(429).json(
      ApiResponse.error('Too many requests. Please try again later.', 429)
    );
  }

  // Default server error
  res.status(500).json(
    ApiResponse.error(
      process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      500
    )
  );
};
