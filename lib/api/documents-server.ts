// lib/api/documents-server.ts
import { cookies } from "next/headers";
import type { 
  Document, 
  DocumentSearchParams, 
  DocumentsResponse, 
  DocumentUploadResponse 
} from '@/types/document';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const DOCUMENTS_ENDPOINT = '/documents';

/**
 * Documents API client for server components
 */
export class DocumentsApiServer {
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
   * Get all documents with optional filtering and pagination
   */
  async getDocuments(params: DocumentSearchParams = {}): Promise<DocumentsResponse> {
    try {
      // Convert params to URL search params
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle enum values properly
          if (key === 'status' && typeof value === 'string') {
            searchParams.append(key, value.toLowerCase());
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return await this.get<DocumentsResponse>(`${DOCUMENTS_ENDPOINT}${query}`);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch documents'
      );
    }
  }
  
  /**
   * Get a specific document by ID
   */
  async getDocument(id: string): Promise<Document> {
    try {
      return await this.get<Document>(`${DOCUMENTS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Failed to fetch document ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch document ${id}`
      );
    }
  }
  
  /**
   * Get document content
   */
  async getDocumentContent(id: string): Promise<string> {
    try {
      return await this.get<string>(`${DOCUMENTS_ENDPOINT}/${id}/content`);
    } catch (error) {
      console.error(`Failed to fetch document content for ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch document content for ${id}`
      );
    }
  }
}

// Create and export a singleton instance
export const documentsApiServer = new DocumentsApiServer();
