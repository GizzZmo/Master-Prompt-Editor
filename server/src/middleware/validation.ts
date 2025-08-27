import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Common validation rules
export const sanitizeString = (field: string, maxLength: number = 1000) => 
  body(field)
    .trim()
    .escape() // Escape HTML characters
    .isLength({ max: maxLength })
    .withMessage(`${field} must be less than ${maxLength} characters`);

export const validateId = (field: string = 'id') =>
  param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`);

// Prompt validation rules
export const validatePromptCreation = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 200 })
    .withMessage('Prompt name must be between 1 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 50000 }) // 50KB limit
    .withMessage('Prompt content must be between 1 and 50,000 characters'),
  
  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters'),
  
  body('category')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  
  handleValidationErrors
];

export const validatePromptUpdate = [
  validateId(),
  
  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 200 })
    .withMessage('Prompt name must be between 1 and 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Prompt content must be between 1 and 50,000 characters'),
  
  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  handleValidationErrors
];

// AI generation validation
export const validateAIGeneration = [
  body('prompt')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Prompt must be between 1 and 10,000 characters'),
  
  body('config')
    .optional()
    .isObject()
    .withMessage('Config must be an object'),
  
  body('config.temperature')
    .optional()
    .isFloat({ min: 0, max: 2 })
    .withMessage('Temperature must be between 0 and 2'),
  
  body('config.maxTokens')
    .optional()
    .isInt({ min: 1, max: 4000 })
    .withMessage('Max tokens must be between 1 and 4000'),
  
  handleValidationErrors
];

// Content analysis validation
export const validateContentAnalysis = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 100000 }) // 100KB for analysis
    .withMessage('Content must be between 1 and 100,000 characters'),
  
  body('analysisType')
    .optional()
    .isIn(['sentiment', 'keywords', 'summary', 'classification'])
    .withMessage('Analysis type must be one of: sentiment, keywords, summary, classification'),
  
  handleValidationErrors
];

// Evaluation validation
export const validatePromptEvaluation = [
  validateId('id'),
  
  body('metric')
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Metric must be between 1 and 100 characters'),
  
  body('score')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Feedback must be less than 5000 characters'),
  
  handleValidationErrors
];

// File upload validation
export const validateFileUpload = [
  body('fileType')
    .isIn(['json', 'csv', 'txt'])
    .withMessage('File type must be json, csv, or txt'),
  
  body('fileSize')
    .isInt({ min: 1, max: 10485760 }) // 10MB
    .withMessage('File size must be between 1 byte and 10MB'),
  
  handleValidationErrors
];

// Query parameter validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Security-focused input sanitization
export const sanitizeAndValidateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Remove potentially dangerous characters from all string inputs
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      // Remove null bytes, control characters, and suspicious patterns
      // Create regex for control characters dynamically to avoid linting issues
      // Use a standard regex for ASCII control characters and DEL
      const controlCharsRegex = /[\x00-\x1F\x7F]/g;
      
      return value
        .replace(controlCharsRegex, '') // Remove control characters
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/data:/gi, '') // Remove data: protocols
        .replace(/<script/gi, '') // Remove script tags
        .replace(/on\w+=/gi, ''); // Remove event handlers
    }
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeValue(req.query) as typeof req.query;
  }

  next();
};