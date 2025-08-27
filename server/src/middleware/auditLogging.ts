import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Audit log entry interface
interface AuditLogEntry {
  timestamp: string;
  action: string;
  resource: string;
  resourceId?: string;
  userIP: string;
  userAgent: string;
  method: string;
  path: string;
  statusCode?: number;
  duration?: number;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Sensitive operations that require audit logging
const SENSITIVE_OPERATIONS = [
  'DELETE',
  'prompt_delete',
  'prompt_export',
  'system_config_change',
  'ai_generation',
  'file_upload',
  'data_export'
];

class AuditLogger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.logFile = path.join(this.logDir, 'audit.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getSeverity(action: string, method: string): 'low' | 'medium' | 'high' | 'critical' {
    if (action.includes('delete') || method === 'DELETE') return 'critical';
    if (action.includes('export') || action.includes('ai_generation')) return 'high';
    if (action.includes('create') || action.includes('update') || method === 'POST' || method === 'PUT') return 'medium';
    return 'low';
  }

  log(entry: Omit<AuditLogEntry, 'timestamp' | 'severity'>) {
    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      severity: this.getSeverity(entry.action, entry.method)
    };

    const logLine = JSON.stringify(fullEntry) + '\n';
    
    // Write to file asynchronously
    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write audit log:', err);
      }
    });

    // Also log to console for immediate visibility
    if (fullEntry.severity === 'critical' || fullEntry.severity === 'high') {
      console.warn('AUDIT LOG:', fullEntry);
    } else {
      console.log('AUDIT LOG:', fullEntry);
    }

    // TODO: Send to external logging service (e.g., Elasticsearch, Splunk, etc.)
    // this.sendToExternalService(fullEntry);
  }

  // Get recent audit logs for monitoring
  getRecentLogs(hours: number = 24): Promise<AuditLogEntry[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.logFile, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve([]); // File doesn't exist yet
            return;
          }
          reject(err);
          return;
        }

        const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        const logs = data
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            try {
              return JSON.parse(line) as AuditLogEntry;
            } catch {
              return null;
            }
          })
          .filter((entry): entry is AuditLogEntry => 
            entry !== null && new Date(entry.timestamp) > cutoffTime
          );

        resolve(logs);
      });
    });
  }
}

const auditLogger = new AuditLogger();

// Custom middleware to log rate limit hits for monitoring
export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture the original res.end to log when request completes
  const originalEnd = res.end.bind(res);
  
  res.end = (...args: any[]) => {
    const duration = Date.now() - startTime;
    
    // Determine if this is a sensitive operation
    const isSensitive = SENSITIVE_OPERATIONS.some(op => 
      req.method === op || 
      req.path.includes(op.toLowerCase()) ||
      (req.method === 'DELETE') ||
      (req.method === 'POST' && (req.path.includes('generate') || req.path.includes('ai')))
    );

    // Log all sensitive operations and failed requests
    if (isSensitive || res.statusCode >= 400) {
      auditLogger.log({
        action: `${req.method.toLowerCase()}_${req.path.split('/').pop() || 'unknown'}`,
        resource: req.path,
        resourceId: req.params.id,
        userIP: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        details: {
          bodySize: req.get('Content-Length'),
          query: Object.keys(req.query).length > 0 ? req.query : undefined,
          // Don't log sensitive body content, just metadata
          hasBody: Object.keys(req.body || {}).length > 0
        }
      });
    }

    return originalEnd(...args);
  };

  next();
};

// Explicit audit logging for specific actions
export const auditAction = (action: string, resource: string, resourceId?: string, details?: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    auditLogger.log({
      action,
      resource,
      resourceId: resourceId || req.params.id,
      userIP: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      method: req.method,
      path: req.path,
      details
    });
    next();
  };
};

// Get audit logs endpoint (for monitoring dashboard)
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const logs = await auditLogger.getRecentLogs(hours);
    res.json({
      logs,
      count: logs.length,
      timeRange: `${hours} hours`
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export { auditLogger };