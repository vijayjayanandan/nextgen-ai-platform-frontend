// lib/i18n/server.ts
import { cookies } from 'next/headers';
import translations from './translations';
import { Locale, defaultLocale, isValidLocale } from './index';

/**
 * Get a template literal tag function that returns translated strings server-side
 * @param locale The locale to use for translations
 * @returns A template literal tag function that translates keys
 */
export async function getTranslations(locale: string) {
  // Default to English if the locale is not supported
  const supportedLocale = isValidLocale(locale) ? locale : defaultLocale;
  
  // Note: We don't set cookies here as it's not a Server Action or Route Handler
  // If you need to set cookies, do it in a Server Action or Route Handler
  
  // Return a function that performs the translation
  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = translations[supportedLocale];
    
    // Traverse the nested translation keys
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for locale ${supportedLocale}`);
        // Fall back to English
        value = getNestedValue(translations.en, keys);
        if (!value) {
          return key; // If still not found, return the key itself
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key} for locale ${supportedLocale}`);
      return key;
    }
    
    // Handle string interpolation for parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return String(params[paramKey] ?? `{{${paramKey}}}`);
      });
    }
    
    return value;
  };
}

/**
 * Helper function to get a nested value from an object
 */
function getNestedValue(obj: any, keys: string[]): string | undefined {
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}
