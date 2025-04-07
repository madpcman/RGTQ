// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  console.log('Middleware triggered for /books path', pathname);

  // 직접 URL 접근 제한
  const isRestricted =
    pathname.match(/^\/books\/\d+\/(edit|delete)$/) ||
    pathname === '/books/new';

  if (isRestricted && request.headers.get('referer') === null) {
    return NextResponse.redirect(new URL('/books/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/books/:path*'], 
};