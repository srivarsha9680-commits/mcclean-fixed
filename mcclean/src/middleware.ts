import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Cleaner dashboard → must be CLEANER
    if (path.startsWith('/cleaner') && token?.role !== 'CLEANER') {
      return NextResponse.redirect(new URL('/customer', req.url));
    }

    // Customer dashboard → must be CUSTOMER
    if (path.startsWith('/customer') && token?.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/cleaner', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/cleaner/:path*', '/customer/:path*'],
};
