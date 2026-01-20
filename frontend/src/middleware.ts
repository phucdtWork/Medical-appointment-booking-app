import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "vi"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Don't redirect API routes or static files
  if (pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check if locale is already in the pathname
  const localeMatch = pathname.split("/").filter(Boolean)[0];

  if (SUPPORTED_LOCALES.includes(localeMatch)) {
    // Locale already in URL, let it through and update cookie
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", localeMatch, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });
    return response;
  }

  // Check if there's a locale cookie
  const localeCookie =
    request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;

  // Redirect to locale
  const response = NextResponse.redirect(
    new URL(`/${localeCookie}${pathname}`, request.url),
  );

  // Ensure cookie is set
  response.cookies.set("NEXT_LOCALE", localeCookie, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    // Match everything except _next and static files
    "/((?!_next|.*\\..*|api).*)",
  ],
};
