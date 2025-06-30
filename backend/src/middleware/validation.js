import Joi from 'joi';
import { ApiError } from '../utils/ApiError.js';

const summaryRequestSchema = Joi.object({
  sessionNotes: Joi.string()
    .min(10)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Session notes must be at least 10 characters long',
      'string.max': 'Session notes cannot exceed 10,000 characters',
      'any.required': 'Session notes are required'
    }),
  
  preferences: Joi.object({
    tone: Joi.string()
      .valid('clinical', 'empathetic', 'neutral')
      .default('neutral')
      .messages({
        'any.only': 'Tone must be one of: clinical, empathetic, neutral'
      }),
    
    includeActionItems: Joi.boolean().default(true),
    
    anonymizeData: Joi.boolean().default(false),
    
    sessionType: Joi.string()
      .valid('therapy', 'psychiatry', 'couples', 'sexual-health')
      .default('therapy')
      .messages({
        'any.only': 'Session type must be one of: therapy, psychiatry, couples, sexual-health'
      }),
    
    summaryLength: Joi.string()
      .valid('short', 'medium', 'detailed')
      .default('medium')
      .messages({
        'any.only': 'Summary length must be one of: short, medium, detailed'
      })
  }).default({})
});

export const validateSummaryRequest = (req, res, next) => {
  const { error, value } = summaryRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new ApiError(400, `Validation Error: ${errorMessage}`);
  }

  req.body = value;
  next();
};
