import { NextResponse, type NextRequest } from 'next/server';
import { ENUM_AUTH_TOKEN_TYPE } from './services/auth-token';
import { DASHBOARD } from './config/menu.config';

export async function proxy(request: NextRequest) {
  const { url, cookies } = request;
  const refreshToken = cookies.get(ENUM_AUTH_TOKEN_TYPE.REFRESH_TOKEN)?.value;
  const isRootPage = new URL(url).pathname === '/';
  const isAuthPage = url.includes('/auth');

  if (isRootPage) {
    return NextResponse.redirect(new URL(refreshToken ? DASHBOARD.HOME : '/auth/', url));
  }

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL(DASHBOARD.HOME, url));
  }
  if (isAuthPage) {
    return NextResponse.next();
  }
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/', url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/posts/:path*', '/auth/:path*'],
};
