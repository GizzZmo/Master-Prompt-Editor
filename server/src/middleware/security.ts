import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Security headers configuration
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // React needs unsafe-inline and unsafe-eval
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "wss:"], // Allow AI API connections
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"], // Prevent clickjacking
      upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS in production
    },
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // X-Frame-Options (prevent clickjacking)
  frameguard: { action: 'deny' },
  
  // X-Content-Type-Options (prevent MIME sniffing)
  noSniff: true,
  
  // X-XSS-Protection (legacy XSS protection)
  xssFilter: true,
  
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  
  // Hide X-Powered-By header
  hidePoweredBy: true
});

// Custom security middleware for additional protections
export const additionalSecurity = (req: Request, res: Response, next: NextFunction) => {
  // Add custom security headers
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Add cache control for sensitive endpoints
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  next();
};

// CORS configuration with security considerations
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'https://your-domain.com',
      'https://www.your-domain.com',
      // Add your production domains here
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']
};

// Request size limiting middleware
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB max request size
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request too large',
      maxSize: '10MB'
    });
  }
  
  next();
};

// IP whitelist middleware (for admin endpoints)
export const createIPWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (allowedIPs.includes(clientIP) || allowedIPs.includes('*')) {
      next();
    } else {
      console.warn(`Blocked request from IP: ${clientIP} to ${req.path}`);
      res.status(403).json({
        error: 'Access denied: IP not whitelisted'
      });
    }
  };
};

// Request timeout middleware
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request timeout',
          timeout: `${timeoutMs}ms`
        });
      }
    });
    next();
  };
};