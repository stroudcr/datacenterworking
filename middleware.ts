import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Redirect non-www to www for production
  if (hostname === 'workindatacenter.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.workindatacenter.com';
    return NextResponse.redirect(url, 308); // Permanent redirect
  }

  return NextResponse.next();
}

// Run middleware on all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
