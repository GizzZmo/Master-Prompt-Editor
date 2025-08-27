import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for AI generation endpoints
export const aiGenerationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 AI requests per 5 minutes
  message: {
    error: 'Too many AI generation requests. Please wait before making more requests.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for prompt operations (less restrictive for regular CRUD)
export const promptOperationsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 prompt operations per 15 minutes
  message: {
    error: 'Too many prompt operations. Please slow down.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiting for sensitive operations (delete, export)
export const sensitiveOperationsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Only 10 sensitive operations per 10 minutes
  message: {
    error: 'Too many sensitive operations. Please wait before trying again.',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom rate limiter for user-specific operations (if we have user auth)
export const createUserRateLimit = (maxRequests: number, windowMs: number) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    keyGenerator: (req: Request) => {
      // For now use IP, but in production this should be user ID
      return req.ip || 'unknown';
    },
    message: {
      error: 'Rate limit exceeded for user operations.',
      retryAfter: `${windowMs / 1000 / 60} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Custom middleware to log rate limit hits for monitoring
export const rateLimitLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Check if this is a rate limit response
    if (res.statusCode === 429) {
      console.warn(`Rate limit hit - IP: ${req.ip}, Path: ${req.path}, Time: ${new Date().toISOString()}`);
      // TODO: Send to monitoring service
    }
    return originalSend.call(this, data);
  };
  
  next();
};