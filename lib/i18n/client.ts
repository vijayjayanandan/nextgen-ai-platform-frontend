// lib/i18n/client.ts
"use client";

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import translations from './translations';

import { Locale, defaultLocale, isValidLocale } from './index';

// Get the current locale from cookies
function getStoredLocale(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  
  const storedLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1];
  
  return isValidLocale(storedLocale) ? storedLocale : defaultLocale;
}

/**
 * Hook to use translations in client components
 */
export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(getStoredLocale());
  const pathname = usePathname();
  const router = useRouter();
  
  // Update locale when the path changes
  useEffect(() => {
    const pathLocale = pathname?.split('/')[1];
    if (isValidLocale(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);
  
  // Translation function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    // Traverse the nested translation keys
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for locale ${locale}`);
        // Fall back to English
        value = getNestedValue(translations.en, keys);
        if (!value) {
          return key; // If still not found, return the key itself
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key} for locale ${locale}`);
      return key;
    }
    
    // Handle string interpolation for parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return String(params[paramKey] ?? `{{${paramKey}}}`);
      });
    }
    
    return value;
  }, [locale]);
  
  // Function to change the locale
  const changeLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // Update the cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    
    // Redirect to the same page but with the new locale
    const segments = pathname?.split('/') || [];
    if (segments.length > 1 && isValidLocale(segments[1])) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
    
    setLocale(newLocale);
  }, [locale, pathname, router]);
  
  return { t, locale, changeLocale };
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
