import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // ✅ Get session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role?.toLowerCase();

  // ✅ 1. Login/Register Page - Logged in user redirect
  if ((path === '/auth/login' || path === '/auth/register') && isLoggedIn) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (role === 'librarian') {
      return NextResponse.redirect(
        new URL('/dashboard/librarian', request.url),
      );
    } else {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
  }

  // ✅ 2. Dashboard - Not logged in redirect to login
  if (path.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ✅ 3. Role check (optional)
  if (path.startsWith('/dashboard/admin') && isLoggedIn && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (
    path.startsWith('/dashboard/librarian') &&
    isLoggedIn &&
    role !== 'librarian' &&
    role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // ✅ Allow all other routes
  return NextResponse.next();
}

// ✅ Config 
export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
