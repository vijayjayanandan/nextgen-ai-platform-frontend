"use client";

import { useEffect, useRef, useState } from "react";
import type { Message as ChatMessage } from "@/types/chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import type { Document as DocumentType } from "@/types/document";
import { chatApi } from "@/lib/api/chat";
import { parseSSEStream } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/client";

interface ChatWindowProps {
  initialMessages?: ChatMessage[];
  conversationId?: string;
  onNewConversation?: (id: string) => void;
  documents?: DocumentType[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  documents?: DocumentType[];
  isStreaming?: boolean;
}

export function ChatWindow({
  initialMessages = [] as ChatMessage[],
  conversationId,
  onNewConversation,
  documents = [] as DocumentType[],
}: ChatWindowProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
      documents: documents.filter((doc) => selectedDocumentIds.includes(doc.id)),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantMessage: ChatMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
        isStreaming: true,
      };

      setCurrentStreamingMessage(assistantMessage);
      abortControllerRef.current = new AbortController();
      const response = await chatApi.createStreamingChatCompletion(content, selectedDocumentIds);
      const stream = response.body;
      if (!stream) throw new Error(t("chat.streamError"));

      let accumulatedContent = "";

      for await (const chunk of parseSSEStream(stream)) {
        try {
          if (chunk.type === 'metadata') {
            console.log('SSE Metadata:', chunk.data);
          } else if (chunk.type === 'data') {
            if (chunk.text && !chunk.text.includes('model')) {
              let cleanText = chunk.text.replace(/\{\}/g, '');
              if (accumulatedContent && !accumulatedContent.endsWith(" ") && !cleanText.startsWith(" ")) {
                accumulatedContent += " ";
              }
              accumulatedContent += cleanText;
              setCurrentStreamingMessage(prev => ({ ...prev!, content: accumulatedContent }));
            }
          } else if (chunk.type === 'done') {
            setCurrentStreamingMessage(prev => ({ ...prev!, isStreaming: false }));
          }
        } catch (e) {
          console.error('Failed to process SSE chunk:', e);
          throw e;
        }
      }

      const finalAssistantMessage: Message = {
        ...assistantMessage,
        content: accumulatedContent,
        isStreaming: false,
      };

      setMessages(prev => [...prev, finalAssistantMessage]);
      setCurrentStreamingMessage(null);

    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : t("chat.messageError"));
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
