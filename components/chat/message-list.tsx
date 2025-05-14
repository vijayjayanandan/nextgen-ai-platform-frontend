// components/chat/message-list.tsx
"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { MessageItem } from "./message-item";

interface MessageListProps {
  messages: Message[];
  streamingMessage: Message | null;
}

export function MessageList({ messages, streamingMessage }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessage?.content]);
  
  // If there are no messages and no streaming message, show a welcome message
  if (messages.length === 0 && !streamingMessage) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Welcome to the AI Assistant
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Ask a question or start a conversation to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-6 py-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {streamingMessage && <MessageItem message={streamingMessage} isStreaming />}
      
      {/* This div is used to auto-scroll to the bottom */}
      <div ref={bottomRef} />
    </div>
  );
}