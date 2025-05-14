// types/document.ts
export interface Document {
  id: string;
  filename: string;
  title: string;
  content_type: string;
  size: number;
  created_at: string;
  updated_at: string;
  status: DocumentStatus;
  metadata: DocumentMetadata;
}

export enum DocumentStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
}

export interface DocumentMetadata {
  page_count?: number;
  security_classification: 'public' | 'protected_a' | 'protected_b' | 'protected_c';
  author?: string;
  created_date?: string;
  modified_date?: string;
  tags?: string[];
  summary?: string;
}

export interface DocumentUploadResponse {
  id: string;
  status: DocumentStatus;
  message?: string;
}

export interface DocumentSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  status?: DocumentStatus;
  sort_by?: 'created_at' | 'title' | 'size';
  sort_order?: 'asc' | 'desc';
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}