import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "vi"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if locale is already in the pathname
  const localeMatch = pathname.split("/").filter(Boolean)[0];

  if (SUPPORTED_LOCALES.includes(localeMatch)) {
    // Locale already in URL, let it through
    return NextResponse.next();
  }

  // Redirect to default locale
  const response = NextResponse.redirect(
    new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url),
  );

  // Set locale cookie for server-side detection
  response.cookies.set("NEXT_LOCALE", DEFAULT_LOCALE);
  return response;
}

export const config = {
  matcher: [
    // Match everything except:
    "/((?!_next|.*\\..*|api).*)",
    // But include api routes that aren't _next or static files
    "/(api|trpc)(.*)",
  ],
};
