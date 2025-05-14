// lib/api/base.ts
"use client";

import { getCookie } from '@/lib/utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    
    const headers = new Headers(options.headers);
    
    // Set content type if not provided
    if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Set authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }
      
      // Handle 401 unauthorized errors (expired token)
      if (response.status === 401) {
        // Token expired, could trigger refresh logic here
        // For now, throwing error to be handled by consumer
        throw new Error('Authentication required');
      }
      
      throw new Error(
        errorData.detail || `API Error: ${response.status} ${response.statusText}`
      );
    }
    
    // Return JSON response for standard requests
    if (options.headers && (options.headers as Record<string, string>)['Accept'] === 'text/event-stream') {
      return response as unknown as T;
    }
    
    return await response.json() as T;
  }
  
  /**
   * Helper methods for common HTTP methods
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }
  
  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
  
  async upload<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const token = getCookie('access_token');
    
    const headers = new Headers(options.headers);
    
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
