import verifyToken from '@/functions/verify-token';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const authenticated = token ? await verifyToken(token) : false;

  if (!authenticated && request.nextUrl.pathname.startsWith('/conta')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (authenticated && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/conta', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/conta/:path*', '/login/:path*', '/conta', '/login'],
};