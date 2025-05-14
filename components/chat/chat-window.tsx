// components/chat/chat-window.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Document } from "@/types/document";
import { chatApi } from "@/lib/api/chat";
import { parseSSEStream } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/client";

interface ChatWindowProps {
  initialMessages?: Message[];
  conversationId?: string;
  onNewConversation?: (id: string) => void;
  documents?: Document[];
}

export function ChatWindow({
  initialMessages = [],
  conversationId,
  onNewConversation,
  documents = [],
}: ChatWindowProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Clean up ongoing stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  const handleSendMessage = async (content: string, selectedDocumentIds: string[] = []) => {
    if (!content.trim()) return;
    setError(null);
    
    // Create a new user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
      documents: documents.filter(doc => selectedDocumentIds.includes(doc.id)),
    };
    
    // Add user message to the list
    setMessages(prev => [...prev, userMessage]);
    
    // Prepare for streaming response
    setIsLoading(true);
    
    try {
      // If no conversation exists, create one
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const newConversation = await chatApi.createConversation(
          content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          "default"
        );
        currentConversationId = newConversation.id;
        if (onNewConversation) {
          onNewConversation(newConversation.id);
        }
      }
      
      // Add the message to the conversation
      await chatApi.addMessage(
        currentConversationId,
        content,
        "user",
        selectedDocumentIds
      );
      
      // Create a placeholder for the streaming response
      const assistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };
      
      setCurrentStreamingMessage(assistantMessage);
      
      // Set up streaming
      abortControllerRef.current = new AbortController();
      
      const response = await chatApi.createStreamingChatCompletion({
        model: "default",
        messages: [
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: userMessage.role, content: userMessage.content },
        ],
        stream: true,
        document_ids: selectedDocumentIds,
      });
      
      // Process the stream
      const stream = response.body;
      if (!stream) {
        throw new Error(t("chat.streamError"));
      }
      
      let accumulatedContent = "";
      
      for await (const chunk of parseSSEStream(stream)) {
        if (chunk.choices[0].delta.content) {
          accumulatedContent += chunk.choices[0].delta.content;
          setCurrentStreamingMessage(prev => ({
            ...prev!,
            content: accumulatedContent,
          }));
        }
        
        // Check if the stream has been aborted
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }
      }
      
      // Final message with the complete content
      const finalAssistantMessage: Message = {
        ...assistantMessage,
        content: accumulatedContent,
      };
      
      setMessages(prev => [...prev, finalAssistantMessage]);
      setCurrentStreamingMessage(null);
      
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("chat.messageError")
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };
  
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsLoading(false);
    
    // Add the current partial response to the messages
    if (currentStreamingMessage) {
      setMessages(prev => [...prev, currentStreamingMessage]);
      setCurrentStreamingMessage(null);
    }
  };
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <MessageList 
          messages={messages} 
          streamingMessage={currentStreamingMessage}
        />
        
        {error && (
          <div className="mt-4 rounded-md bg-accent-50 p-4 text-accent-600 border border-accent-100">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              {t("common.dismiss")}
            </button>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={handleStopGeneration}
          documents={documents}
        />
      </div>
    </div>
  );
}