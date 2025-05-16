"use client";

import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isLastMessage?: boolean;
  isStreaming?: boolean;
}

export function MessageItem({ message, isLastMessage = false, isStreaming = false }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        "flex w-full my-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "rounded-lg p-4 max-w-md",
          isUser
            ? "bg-primary text-white" // Better contrast for user messages
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <div className="space-y-2">
          <div className={cn("font-medium", isUser && "text-white")}>
            {message.role === 'user' ? 'You' : 'Assistant'}
          </div>
          
          {/* Display raw text content without Markdown processing */}
          <div className={cn("whitespace-pre-wrap", isUser && "text-white")}>
            {message.content}
          </div>
          
          <div className={cn(
            "text-xs",
            isUser ? "text-gray-200" : "text-muted-foreground"
          )}>
            {new Date(message.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}