// lib/i18n/index.ts

// Define supported locales
export type Locale = 'en';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en'];

// Helper function to check if a locale is supported
export function isValidLocale(locale: string | undefined): locale is Locale {
  return typeof locale === 'string' && locales.includes(locale as Locale);
}

// Get locale from path
export function getLocaleFromPath(path: string): Locale {
  const locale = path.split('/')[1];
  return isValidLocale(locale) ? locale : defaultLocale;
}
