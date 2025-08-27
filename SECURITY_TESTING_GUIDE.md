# Security Testing Guide

This document outlines security testing procedures and guidelines for the Master Prompt Editor application.

## Overview

The application has implemented comprehensive security measures including:
- ✅ Rate limiting for API endpoints
- ✅ Input validation and sanitization
- ✅ Audit logging for sensitive operations
- ✅ Security headers and CORS protection
- ✅ Error boundaries for better error handling
- ✅ Upgraded dependencies to address vulnerabilities

## Security Testing Checklist

### 1. Rate Limiting Tests

Test the rate limiting functionality to ensure it protects against abuse:

```bash
# Test general API rate limiting (100 requests per 15 minutes)
for i in {1..105}; do
  curl -s http://localhost:3001/api/prompts
done

# Test AI generation rate limiting (20 requests per 5 minutes)
for i in {1..25}; do
  curl -s -X POST http://localhost:3001/api/ai/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test"}'
done

# Test sensitive operations rate limiting (10 requests per 10 minutes)
for i in {1..15}; do
  curl -s -X DELETE http://localhost:3001/api/prompts/test-id
done
```

**Expected Results:**
- Requests should be blocked after limits are exceeded
- Response should include proper rate limit headers
- Status code 429 (Too Many Requests) should be returned

### 2. Input Validation Tests

Test input validation to prevent malicious input:

```bash
# Test XSS prevention
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(\"xss\")</script>", "content": "test"}'

# Test SQL injection patterns (should be sanitized)
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"name": "\"; DROP TABLE prompts; --", "content": "test"}'

# Test oversized content
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "content": "'$(python -c "print('A' * 100000)")'"}'"

# Test invalid UUID
curl http://localhost:3001/api/prompts/invalid-uuid
```

**Expected Results:**
- Malicious input should be sanitized or rejected
- Oversized content should be rejected with 400 status
- Invalid UUIDs should return validation errors

### 3. Security Headers Tests

Verify security headers are properly set:

```bash
# Check security headers
curl -I http://localhost:3001/health

# Should include headers like:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: ...
```

### 4. CORS Testing

Test Cross-Origin Resource Sharing protection:

```bash
# Test CORS with invalid origin
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS \
  http://localhost:3001/api/prompts
```

**Expected Results:**
- Requests from unauthorized origins should be blocked
- Proper CORS headers should be returned for valid origins

### 5. Error Boundary Testing

Test React error boundaries by causing intentional errors:

1. Open browser developer tools
2. Navigate to different pages
3. Cause JavaScript errors by:
   - Modifying component props in dev tools
   - Triggering network failures
   - Corrupting localStorage data

**Expected Results:**
- Error boundaries should catch errors gracefully
- User should see friendly error messages, not crashes
- Errors should be logged to console with proper context

### 6. Audit Logging Verification

Check that sensitive operations are properly logged:

```bash
# Perform sensitive operations
curl -X DELETE http://localhost:3001/api/prompts/test-id
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

# Check audit logs
curl http://localhost:3001/api/admin/audit-logs
```

**Expected Results:**
- All sensitive operations should be logged
- Logs should include timestamp, IP, action, and result
- Log files should be created in `server/logs/audit.log`

## Automated Security Testing

### Using OWASP ZAP

1. Install OWASP ZAP
2. Configure proxy to point to http://localhost:3001
3. Run automated scan for common vulnerabilities

### Using npm audit

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically fixable vulnerabilities
npm audit fix

# Force fix breaking changes (use carefully)
npm audit fix --force
```

### Using Burp Suite

1. Configure Burp Suite proxy
2. Browse the application through the proxy
3. Run active scan on discovered endpoints
4. Review findings for:
   - SQL injection
   - XSS vulnerabilities
   - CSRF issues
   - Authentication bypasses

## Security Monitoring

### Real-time Monitoring

Monitor the following in production:

1. **Rate Limit Hits**: Check logs for excessive rate limit violations
2. **Validation Failures**: Monitor input validation rejections
3. **Error Rates**: Track error boundary activations
4. **Audit Logs**: Review sensitive operation logs regularly

### Log Analysis

```bash
# Monitor rate limit violations
tail -f server/logs/audit.log | grep "Rate limit hit"

# Monitor validation failures
tail -f server/logs/audit.log | grep "Validation failed"

# Monitor critical operations
tail -f server/logs/audit.log | grep '"severity":"critical"'
```

## Penetration Testing Recommendations

### External Testing

1. **Network Security**: Test firewall rules and network segmentation
2. **SSL/TLS Configuration**: Verify certificate configuration and cipher suites
3. **API Security**: Test authentication, authorization, and API-specific vulnerabilities
4. **Infrastructure**: Scan for open ports, services, and misconfigurations

### Internal Testing

1. **Application Logic**: Test business logic flaws
2. **Session Management**: Verify session handling security
3. **File Handling**: Test file upload/download security
4. **Database Security**: Test data access controls

## Security Incident Response

If security issues are found:

1. **Document** the vulnerability with steps to reproduce
2. **Assess** the severity and potential impact
3. **Patch** the vulnerability following secure coding practices
4. **Verify** the fix with additional testing
5. **Update** security documentation and testing procedures

## Compliance Considerations

Ensure compliance with relevant standards:

- **OWASP Top 10**: Address top web application security risks
- **GDPR**: If handling EU user data
- **SOC 2**: For service organization controls
- **ISO 27001**: For information security management

## Regular Security Reviews

Schedule regular security reviews:

- **Weekly**: Review audit logs and monitoring alerts
- **Monthly**: Run vulnerability scans and update dependencies
- **Quarterly**: Conduct penetration testing and security assessments
- **Annually**: Review and update security policies and procedures