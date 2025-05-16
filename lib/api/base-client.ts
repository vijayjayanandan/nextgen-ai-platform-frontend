// lib/api/base-client.ts
"use client";

import { getCookie } from '@/lib/utils/cookies-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Base API client for making authenticated requests to the backend in client components
 */
export class ApiClientClient {
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
    const accessToken = getCookie('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}
