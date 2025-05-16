// lib/api/chat-server.ts
import { cookies } from "next/headers";
import type { 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  Conversation,
  Message
} from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const CHAT_ENDPOINTS = {
  COMPLETIONS: '/chat/completions',
  STREAM: '/chat/stream',
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: '/chat/messages',
};

/**
 * Chat API client for server components
 */
export class ChatApiServer {
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
    // In Next.js 15+, cookies() is an async function
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    // Create headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Set authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Copy existing headers if any
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.append(key, value);
        });
      } else if (Array.isArray(options.headers)) {
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
    
    return response.text() as unknown as T;
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
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
  
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      return await this.get<Conversation[]>(CHAT_ENDPOINTS.CONVERSATIONS);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch conversations'
      );
    }
  }
  
  /**
   * Get a specific conversation by ID
   */
  async getConversation(id: string): Promise<Conversation> {
    try {
      return await this.get<Conversation>(`${CHAT_ENDPOINTS.CONVERSATIONS}/${id}`);
    } catch (error) {
      console.error(`Failed to fetch conversation ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch conversation ${id}`
      );
    }
  }
}

// Create and export a singleton instance
export const chatApiServer = new ChatApiServer();
