// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { query } from '@/lib/db';

export async function middleware(request: NextRequest) {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const sessionId = cookies.session_id;

  if (sessionId) {
    try {
      // Verify session
      const results = await query('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
      if (results.length > 0) {
        return NextResponse.next(); // Continue to the requested page
      }
    } catch (error) {
      console.error('Error verifying session:', error);
    }
  }

  // Redirect to login if session is not valid
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/protected/**'], // Apply middleware only to protected routes
};
