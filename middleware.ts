import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    if (token?.status && token.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/auth/error?error=AccountDisabled', request.url));
    }

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN' && token?.role !== 'MODERATOR') {
      return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/chat/:path*'],
};
