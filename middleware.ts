// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// List of supported locales
const LOCALES = ['en']; // Removed 'fr' to match lib/i18n/index.ts
export const DEFAULT_LOCALE = 'en';

// Get the preferred locale from headers
function getLocale(request: NextRequest): string {
  // Use Negotiator to parse the Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  // Match the preferred locale
  try {
    return matchLocale(languages, LOCALES, DEFAULT_LOCALE);
  } catch (error) {
    return DEFAULT_LOCALE;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = LOCALES.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  
  // Skip middleware for API routes, _next routes, and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Redirect to locale-prefixed URL if locale is missing
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Redirect to the locale-prefixed URL
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}${request.nextUrl.search}`,
        request.url
      )
    );
  }
  
  // Authentication check for protected routes
  if (pathname.includes('/chat') || pathname.includes('/documents') || pathname.includes('/settings')) {
    // Get the access token from cookie or authorization header
    const token = request.cookies.get('access_token')?.value || request.headers.get('authorization')?.split(' ')[1];
    
    // If no token exists, redirect to the login page
    if (!token) {
      const locale = getLocale(request);
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(request.url)}`, request.url)
      );
    }
    
    // Here you could also validate the token (expiry, signature) with server actions if needed
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static assets and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
