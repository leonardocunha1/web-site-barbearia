
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const url = request.nextUrl.clone();

  // Se não tiver nenhum token, manda pro login
  if (!token && !refreshToken && url.pathname.startsWith('/conta')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Se tiver token expirado mas refresh existe, deixa passar
  if (url.pathname.startsWith('/login') && token) {
    url.pathname = '/conta';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}



export const config = {
  matcher: ['/conta/:path*', '/login/:path*', '/conta', '/login'],


  // import { NextResponse, type NextRequest } from 'next/server';
  // import verifyToken from '@/functions/verify-token';
  
  // export async function middleware(request: NextRequest) {
  //   const token = request.cookies.get('accessToken')?.value;
  //   const refreshToken = request.cookies.get('refreshToken')?.value;
  
  //   const url = request.nextUrl.clone();
  //   let authenticated = false;
  
  //   if (token) {
  //     authenticated = await verifyToken(token); // true se válido
  //   }
  
  //   // Se não tiver nenhum token válido nem refresh token, manda pro login
  //   if (!authenticated && !refreshToken && url.pathname.startsWith('/conta')) {
  //     url.pathname = '/login';
  //     return NextResponse.redirect(url);
  //   }
  
  //   // Se tiver token válido e estiver no login, manda pra conta
  //   if (authenticated && url.pathname.startsWith('/login')) {
  //     url.pathname = '/conta';
  //     return NextResponse.redirect(url);
  //   }
  
  //   return NextResponse.next();
  // }
};