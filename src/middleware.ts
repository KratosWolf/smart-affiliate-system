import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // MIDDLEWARE TEMPORARILY DISABLED FOR DEBUGGING
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};