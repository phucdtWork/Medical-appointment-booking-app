// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Don't run middleware on API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check if pathname has locale prefix
  const pathnameHasLocale = /^\/(vi|en)/.test(pathname);

  // If no locale prefix and not root, add default locale
  if (!pathnameHasLocale && pathname !== "/") {
    return NextResponse.next();
  }

  // Redirect / to /en
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
