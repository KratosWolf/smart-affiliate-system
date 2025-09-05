import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers (OWASP Top 10 compliance)
  
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filtering
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict dangerous browser features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Content Security Policy - Fixed for Next.js production
  // Next.js requires 'unsafe-inline' and 'unsafe-eval' for client-side hydration
  const cspPolicy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://www.googleapis.com https://googleads.googleapis.com;";
  
  response.headers.set('Content-Security-Policy', cspPolicy);

  // Add custom security headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Prevent caching of API responses by default
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    // Add API-specific security headers
    response.headers.set('X-API-Version', '1.0');
    
    // Add smart affiliate system specific headers
    response.headers.set('X-Service', 'smart-affiliate-system');
  }

  // CORS handling for webhook and tracking endpoints
  const publicApiPaths = [
    '/api/v1/webhook',
    '/api/v1/track',
    '/api/v1/pixel',
    '/api/v1/redirect'
  ];
  const isPublicApi = publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicApi) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Add CORS headers to public API responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  }

  // Rate limiting preparation (headers for monitoring)
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 
    request.headers.get('x-real-ip') ?? 
    'unknown';
  
  response.headers.set('X-Client-IP', clientIP);
  response.headers.set('X-Timestamp', new Date().toISOString());

  // Smart Affiliate System specific middleware
  
  // Block known affiliate spam patterns
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const suspiciousPatterns = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'python-requests'
  ];
  
  // Only block on sensitive endpoints, not on webhooks/tracking
  const sensitiveEndpoints = ['/api/v1/validation', '/api/v1/campaigns', '/api/v1/optimization'];
  const isSensitiveEndpoint = sensitiveEndpoints.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isSensitiveEndpoint && suspiciousPatterns.some(pattern => userAgent.includes(pattern))) {
    response.headers.set('X-Block-Reason', 'Suspicious User Agent');
    // Log for monitoring but don't block in development
    if (process.env.NODE_ENV === 'production') {
      console.warn('🚫 Blocked suspicious request:', {
        ip: clientIP,
        userAgent,
        path: request.nextUrl.pathname
      });
    }
  }

  // Add performance monitoring headers (static timestamp to avoid hydration mismatch)
  response.headers.set('X-Response-Time-Start', '0');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};