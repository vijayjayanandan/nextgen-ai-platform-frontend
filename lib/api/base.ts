// lib/api/base.ts
"use client";

import { getCookie } from '@/lib/utils/cookies-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Base API client for making authenticated requests to the backend
 */
export class ApiClient {
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
    
    // Initialize headers
    const headers = new Headers();
    
    // Copy existing headers if any
    if (options.headers) {
      if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.append(key, String(value));
        });
      } else if (typeof options.headers === 'object') {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.append(key, String(value));
        });
      }
    }
    
    // Set authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      console.error('API Request Details:', {
        url: `${this.baseUrl}${endpoint}`,
        method: options.method,
        headers: headers,
        body: options.body,
        status: response.status,
        statusText: response.statusText
      });

      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
        console.error('API Error Response:', {
          statusCode: response.status,
          statusText: response.statusText,
          error: errorData,
          rawResponse: errorText
        });
      } catch (e) {
        console.error('API Error Response (non-JSON):', {
          statusCode: response.status,
          statusText: response.statusText,
          rawResponse: errorText
        });
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Log successful responses for debugging
    console.log('API Response:', {
      url: `${this.baseUrl}${endpoint}`,
      status: response.status,
      statusText: response.statusText
    });

    // Return raw response for streaming
    if (options.headers && typeof options.headers === 'object' && 'get' in options.headers) {
      const headers = options.headers as Headers;
      if (headers.get('Accept') === 'text/event-stream') {
        return response as unknown as T;
      }
    }
    
    // Parse response based on content type
    const contentType = response.headers.get('Content-Type');
    
    if (contentType?.includes('application/json')) {
      return response.json() as T;
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
    
    // Create headers without explicitly setting Content-Type so that the
    // browser can automatically add the correct multipart boundary
    const headers = new Headers();
    
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
    
    // Don't set Content-Type header as it's automatically set with the correct boundary
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }
      
      throw new Error(
        errorData.detail || `API Error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json() as T;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
