// lib/utils/cookies-client.ts
"use client";

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(`${name}=`) === 0) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
  } = {}
): void {
  const cookieOptions = [];
  
  if (options.maxAge) {
    cookieOptions.push(`Max-Age=${options.maxAge}`);
  }
  
  if (options.path) {
    cookieOptions.push(`Path=${options.path}`);
  }
  
  if (options.sameSite) {
    cookieOptions.push(`SameSite=${options.sameSite}`);
  }
  
  if (options.secure) {
    cookieOptions.push('Secure');
  }
  
  document.cookie = `${name}=${value};${cookieOptions.join('; ')}`;
}

export function deleteCookie(name: string, options: { path?: string } = {}): void {
  setCookie(name, '', { ...options, maxAge: 0 });
}
