// lib/api/base-server.ts

import { getCookie } from '@/lib/utils/cookies-server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Base API client for making authenticated requests to the backend in server components
 */
export class ApiClientServer {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Make a fetch request to the API with proper authorization
   */
  async fetch<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = getCookie('access_token');
    
    // Create headers
    const headers = new Headers();
    
    // Set authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Copy existing headers if any
    if (options.headers) {
      if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.append(key, value as string);
        });
      } else if (typeof options.headers === 'object') {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.append(key, value as string);
        });
      }
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }
    
    // Parse response based on content type
    const contentType = response.headers.get('Content-Type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    if (contentType?.includes('text/event-stream')) {
      return response as T;
    }
    
    return response.text() as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const token = getCookie('access_token');
    
    // Create headers
    const headers = new Headers({
      'Content-Type': 'multipart/form-data'
    });
    
    // Add any additional headers
    if (options.headers) {
      if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.append(key, value);
        });
      } else if (typeof options.headers === 'object') {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.append(key, value);
        });
      }
    }
    
    // Set authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}
