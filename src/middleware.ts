import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Basic middleware with minimal overhead
  const response = NextResponse.next();

  // Add basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Log API requests in development
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`🔧 API Request: ${request.method} ${request.nextUrl.pathname}`);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};