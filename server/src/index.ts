import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import promptRoutes from './routes/promptRoutes';

// Security middleware imports
import { 
  generalRateLimit, 
  rateLimitLogger,
  aiGenerationRateLimit,
  promptOperationsRateLimit,
  sensitiveOperationsRateLimit
} from './middleware/rateLimiting';
import { 
  securityHeaders, 
  additionalSecurity, 
  corsOptions, 
  requestSizeLimit,
  requestTimeout
} from './middleware/security';
import { 
  auditMiddleware, 
  getAuditLogs,
  auditAction
} from './middleware/auditLogging';
import { sanitizeAndValidateRequest } from './middleware/validation';

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers (apply first)
app.use(securityHeaders);
app.use(additionalSecurity);

// CORS with security configuration
app.use(cors(corsOptions));

// Request size limiting
app.use(requestSizeLimit);

// Request timeout
app.use(requestTimeout(30000)); // 30 second timeout

// Rate limiting logger
app.use(rateLimitLogger);

// General rate limiting for all requests
app.use(generalRateLimit);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization and validation
app.use(sanitizeAndValidateRequest);

// Audit logging for all requests
app.use(auditMiddleware);

// API Routes with specific rate limiting
app.use('/api/ai', 
  aiGenerationRateLimit,
  auditAction('ai_request', 'ai_api'),
  aiRoutes
);

app.use('/api/prompts', 
  promptOperationsRateLimit,
  promptRoutes
);

// Admin/monitoring endpoints
app.get('/api/admin/audit-logs', 
  sensitiveOperationsRateLimit,
  auditAction('audit_logs_access', 'admin_endpoint'),
  getAuditLogs
);

// Health check endpoint (with minimal rate limiting)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Security monitoring endpoint
app.get('/api/security/status', 
  sensitiveOperationsRateLimit,
  auditAction('security_status_check', 'security_endpoint'),
  (_req: Request, res: Response) => {
    res.json({
      status: 'secure',
      features: {
        rateLimiting: true,
        inputValidation: true,
        auditLogging: true,
        securityHeaders: true,
        cors: true
      },
      timestamp: new Date().toISOString()
    });
  }
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  
  // Log security-related errors
  if (err.message && err.message.includes('CORS')) {
    console.warn(`CORS error from IP: ${req.ip}, Origin: ${req.get('Origin')}`);
  }
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status((err as Error & { status?: number }).status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🔒 Secure server running on http://localhost:${PORT}`);
  console.log('🛡️  Security features enabled:');
  console.log('   ✅ Rate limiting');
  console.log('   ✅ Input validation');
  console.log('   ✅ Audit logging');
  console.log('   ✅ Security headers');
  console.log('   ✅ CORS protection');
  console.log('   ✅ Request size limits');
  console.log('   ✅ Request timeouts');
});
