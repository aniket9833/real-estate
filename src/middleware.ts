import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/jwt';

/**
 * Route-level gate for the admin area. This runs on the Edge runtime before
 * any admin page renders, so an unauthenticated visitor never sees admin UI
 * flash before redirecting. Individual server actions/route handlers still
 * re-verify the session independently - middleware is defense in depth, not
 * the only check.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
