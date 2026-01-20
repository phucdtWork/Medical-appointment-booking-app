// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["vi", "en"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pathname } = request.nextUrl as any;

  // Redirect / đến /vi (default)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return intlMiddleware(request as any);
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
