// lib/api/chat.ts
import { ApiClientClient } from './base-client';

const apiClient = new ApiClientClient();
import type { 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  Conversation,
  Message
} from '@/types/chat';

const CHAT_ENDPOINTS = {
  COMPLETIONS: '/chat/completions',
  STREAM: '/chat/stream',
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: '/chat/messages',
};

/**
 * Chat API client for interacting with chat endpoints
 */
export class ChatApi {
  private client = apiClient;

  /**
   * Send a non-streaming chat completion request
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    try {
      return await apiClient.post<ChatCompletionResponse>(
        CHAT_ENDPOINTS.COMPLETIONS,
        { ...request, stream: false }
      );
    } catch (error) {
      console.error('Chat completion failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate chat completion'
      );
    }
  }
  
  /**
   * Send a streaming chat completion request
   * Returns the raw Response object for streaming
   */
  async createStreamingChatCompletion(
    content: string,
    selectedDocumentIds: string[] = []
  ): Promise<Response> {
    try {
      let token = '';
      
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && document.cookie) {
        // Extract token from client-side cookies
        token = document.cookie.split('access_token=')[1]?.split(';')[0] || '';
      } else {
        // For server-side, we would use the cookies API, but this is primarily a client-side method
        // This will be handled by the apiClient's fetch method
      }
      
      // Use the raw Response object for streaming
      const response = await fetch(`${apiClient['baseUrl']}${CHAT_ENDPOINTS.STREAM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          messages: [
            { role: "user", content }
          ],
          stream: true,
          max_tokens: 1000, // Limit response length
          temperature: 0.7, // Balance between deterministic and creative responses
          document_ids: selectedDocumentIds
        }),
        credentials: 'include', // Include cookies in the request
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.error('Streaming chat completion failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate streaming chat completion'
      );
    }
  }
  
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      return await apiClient.get<Conversation[]>(CHAT_ENDPOINTS.CONVERSATIONS);
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
      return await apiClient.get<Conversation>(`${CHAT_ENDPOINTS.CONVERSATIONS}/${id}`);
    } catch (error) {
      console.error(`Failed to fetch conversation ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to fetch conversation ${id}`
      );
    }
  }
  
  /**
   * Create a new conversation
   */
  async createConversation(title: string, model: string): Promise<Conversation> {
    try {
      return await apiClient.post<Conversation>(CHAT_ENDPOINTS.CONVERSATIONS, { 
        title, 
        model 
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create conversation'
      );
    }
  }
  
  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string, 
    content: string, 
    role: 'user' | 'system' = 'user',
    documentIds?: string[]
  ): Promise<Message> {
    try {
      return await apiClient.post<Message>(
        `${CHAT_ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`,
        { content, role, document_ids: documentIds }
      );
    } catch (error) {
      console.error('Failed to add message:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to add message'
      );
    }
  }
  
  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`${CHAT_ENDPOINTS.CONVERSATIONS}/${id}`);
    } catch (error) {
      console.error(`Failed to delete conversation ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to delete conversation ${id}`
      );
    }
  }
  
  /**
   * Update a conversation title
   */
  async updateConversationTitle(id: string, title: string): Promise<Conversation> {
    try {
      return await apiClient.put<Conversation>(
        `${CHAT_ENDPOINTS.CONVERSATIONS}/${id}`,
        { title }
      );
    } catch (error) {
      console.error(`Failed to update conversation ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to update conversation ${id}`
      );
    }
  }
}

// Create and export a singleton instance
export const chatApi = new ChatApi();
