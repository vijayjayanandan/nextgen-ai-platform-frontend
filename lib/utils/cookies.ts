// lib/utils/cookies.ts
"use client";

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') return;
  
  let cookie = `${name}=${value}`;
  
  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }
  
  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.path) {
    cookie += `; path=${options.path}`;
  }
  
  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }
  
  if (options.secure) {
    cookie += '; secure';
  }
  
  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookie;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
