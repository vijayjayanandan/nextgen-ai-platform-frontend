// types/chat.ts
import type { Document } from './document';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  documents?: Document[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
  model: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  temperature?: number;
  stream?: boolean;
  document_ids?: string[];
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | null;
  }[];
}

export interface StreamingChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason: 'stop' | 'length' | null;
  }[];
}