import { NextRequest } from 'next/server';

/**
 * Extract client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Try different headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const remoteAddr = request.headers.get('remote-addr');
  if (remoteAddr) {
    return remoteAddr.trim();
  }
  
  return request.ip ?? 'unknown';
}

/**
 * Generate secure random string for tokens/secrets
 */
export function generateSecureToken(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  
  return result;
}

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate URL to prevent SSRF attacks - Enhanced for affiliate URLs
 */
export function validateURL(url: string, options?: {
  allowedDomains?: string[];
  allowAffiliateParams?: boolean;
}): boolean {
  const { allowedDomains, allowAffiliateParams = true } = options || {};
  
  try {
    const parsedURL = new URL(url);
    
    // Block dangerous protocols
    const dangerousProtocols = ['file:', 'ftp:', 'gopher:', 'dict:', 'javascript:'];
    if (dangerousProtocols.includes(parsedURL.protocol)) {
      return false;
    }
    
    // Only allow HTTP/HTTPS for affiliate links
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return false;
    }
    
    // Block private IP ranges
    const hostname = parsedURL.hostname;
    const privateIPRegex = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|::1|localhost)/;
    if (privateIPRegex.test(hostname)) {
      return false;
    }
    
    // Check for suspicious affiliate patterns
    if (!allowAffiliateParams) {
      const suspiciousParams = ['eval', 'exec', 'script', 'iframe'];
      const searchParams = parsedURL.search.toLowerCase();
      if (suspiciousParams.some(param => searchParams.includes(param))) {
        return false;
      }
    }
    
    // Check allowed domains if specified
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      if (!isAllowed) {
        return false;
      }
    }
    
    // Additional security: Check for very long URLs (potential DoS)
    if (url.length > 2048) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash sensitive data (passwords, API keys)
 */
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  // For now, using native crypto API with salt
  const salt = generateSecureToken(16);
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${salt}:${hashHex}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) return false;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const newHash = await crypto.subtle.digest('SHA-256', data);
    
    const newHashArray = Array.from(new Uint8Array(newHash));
    const newHashHex = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return newHashHex === hash;
  } catch {
    return false;
  }
}

/**
 * Generate API key for external integrations
 */
export function generateApiKey(): string {
  return `sas_${generateSecureToken(32)}`;
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;
  return /^sas_[A-Za-z0-9]{32}$/.test(apiKey);
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(40);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}

/**
 * Rate limiting key generation for different actions
 */
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

/**
 * Smart Affiliate System specific rate limits
 */
export const RATE_LIMITS = {
  productValidation: { requests: 10, window: 3600 }, // 10 validations per hour
  campaignCreation: { requests: 5, window: 3600 },   // 5 campaigns per hour
  optimization: { requests: 50, window: 3600 },      // 50 optimizations per hour
  apiGeneral: { requests: 100, window: 3600 },       // 100 general API calls per hour
  webhook: { requests: 1000, window: 3600 },         // 1000 webhook calls per hour
} as const;

/**
 * Security audit logging
 */
export interface SecurityEvent {
  event: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userId?: string;
  userAgent?: string;
  endpoint?: string;
  details?: Record<string, any>;
}

export function logSecurityEvent(event: SecurityEvent): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    service: 'smart-affiliate-system',
    ...event,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', logEntry);
  }
  
  // In production, send to logging service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with logging service
    console.error('Security Event:', logEntry);
  }
}

/**
 * Validate affiliate product URL
 */
export function validateAffiliateProductUrl(url: string): { valid: boolean; error?: string } {
  // Basic URL validation
  if (!validateURL(url, { allowAffiliateParams: true })) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  try {
    const parsedUrl = new URL(url);
    
    // Check for common e-commerce platforms
    const supportedDomains = [
      'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es',
      'aliexpress.com', 'ebay.com', 'shopify.com', 'woocommerce.com',
      'mercadolivre.com.br', 'americanas.com.br', 'magazineluiza.com.br',
      'shopee.com.br', 'casasbahia.com.br'
    ];
    
    const hostname = parsedUrl.hostname.toLowerCase();
    const isSupported = supportedDomains.some(domain => 
      hostname.includes(domain)
    );
    
    if (!isSupported) {
      // Allow custom domains but warn
      console.warn('⚠️ Unsupported domain for product validation:', hostname);
    }
    
    // Check for suspicious parameters
    const params = parsedUrl.searchParams;
    const suspiciousParams = ['eval', 'exec', 'script', 'iframe', 'javascript'];
    
    for (const [key, value] of params.entries()) {
      const lowerKey = key.toLowerCase();
      const lowerValue = value.toLowerCase();
      
      if (suspiciousParams.some(suspicious => 
        lowerKey.includes(suspicious) || lowerValue.includes(suspicious)
      )) {
        return { valid: false, error: 'Suspicious URL parameters detected' };
      }
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate file upload security for campaign assets
 */
export function validateFileUpload(
  filename: string, 
  mimetype: string, 
  size: number,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  // Check file size
  if (size > maxSize) {
    return { valid: false, error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB` };
  }
  
  // Check MIME type
  if (!allowedTypes.includes(mimetype)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  // Check file extension
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension not allowed' };
  }
  
  // Check for dangerous filenames
  const dangerousPatterns = [
    /\.\./,  // Path traversal
    /[<>]/,  // HTML/XML chars
    /[&$`|;]/,  // Shell injection chars
    /\.(exe|bat|cmd|scr|pif|com|dll)$/i,  // Executable files
  ];
  
  if (dangerousPatterns.some(pattern => pattern.test(filename))) {
    return { valid: false, error: 'Invalid filename' };
  }
  
  return { valid: true };
}

/**
 * Environment-specific security configuration
 */
export const securityConfig = {
  development: {
    rateLimitEnabled: false,
    strictCSP: false,
    auditLogging: false,
    requireHttps: false,
  },
  production: {
    rateLimitEnabled: true,
    strictCSP: true,
    auditLogging: true,
    requireHttps: true,
  }
} as const;

/**
 * Get current security configuration
 */
export function getSecurityConfig() {
  const env = process.env.NODE_ENV as keyof typeof securityConfig;
  return securityConfig[env] || securityConfig.development;
}