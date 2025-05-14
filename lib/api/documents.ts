// lib/api/documents.ts
import { apiClient } from './base';
import type { 
  Document, 
  DocumentSearchParams, 
  DocumentsResponse, 
  DocumentUploadResponse 
} from '@/types/document';

const DOCUMENTS_ENDPOINT = '/documents';

/**
 * Documents API client for managing documents
 */
export class DocumentsApi {
  /**
   * Get all documents with optional filtering and pagination
   */
  async getDocuments(params: DocumentSearchParams = {}): Promise<DocumentsResponse> {
    try {
      // Convert params to URL search params
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return await apiClient.get<DocumentsResponse>(`${DOCUMENTS_ENDPOINT}${query}`);
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
      return await apiClient.get<Document>(`${DOCUMENTS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Failed to fetch document ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch document ${id}`
      );
    }
  }
  
  /**
   * Upload a new document
   */
  async uploadDocument(
    file: File, 
    metadata: { title?: string; security_classification: string; tags?: string[] }
  ): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata as JSON string
      formData.append('metadata', JSON.stringify(metadata));
      
      return await apiClient.upload<DocumentUploadResponse>(DOCUMENTS_ENDPOINT, formData);
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to upload document'
      );
    }
  }
  
  /**
   * Update document metadata
   */
  async updateDocument(
    id: string, 
    updates: { title?: string; security_classification?: string; tags?: string[] }
  ): Promise<Document> {
    try {
      return await apiClient.put<Document>(`${DOCUMENTS_ENDPOINT}/${id}`, updates);
    } catch (error) {
      console.error(`Failed to update document ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to update document ${id}`
      );
    }
  }
  
  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`${DOCUMENTS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Failed to delete document ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to delete document ${id}`
      );
    }
  }
  
  /**
   * Get document content
   */
  async getDocumentContent(id: string): Promise<string> {
    try {
      return await apiClient.get<string>(`${DOCUMENTS_ENDPOINT}/${id}/content`);
    } catch (error) {
      console.error(`Failed to fetch document content for ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch document content for ${id}`
      );
    }
  }
}

// Create and export a singleton instance
export const documentsApi = new DocumentsApi();
