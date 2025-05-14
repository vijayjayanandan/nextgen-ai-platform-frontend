// components/chat/message-input.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Document } from "@/types/document";
import { useTranslation } from "@/lib/i18n/client";

interface MessageInputProps {
  onSendMessage: (content: string, documentIds: string[]) => void;
  isLoading: boolean;
  onStop: () => void;
  documents?: Document[];
}

export function MessageInput({
  onSendMessage,
  isLoading,
  onStop,
  documents = [],
}: MessageInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    
    // Set height based on scrollHeight (with min and max constraints)
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200);
    textarea.style.height = `${newHeight}px`;
  }, [message]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // For IME composition (e.g., CJK input methods)
    if (e.key === "Process") {
      setIsComposing(true);
    }
    
    // Composition has ended
    if (e.key === "Enter") {
      setIsComposing(false);
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message, selectedDocumentIds);
      setMessage("");
      setSelectedDocumentIds([]);
      setShowDocumentSelector(false);
    }
  };
  
  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };
  
  return (
    <div className="space-y-2">
      {showDocumentSelector && documents.length > 0 && (
        <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm font-medium mb-2">{t("chat.selectDocuments")}</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggleDocumentSelection(doc.id)}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedDocumentIds.includes(doc.id)
                    ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                <DocumentIcon className="mr-1 h-3 w-3" />
                {doc.title || doc.filename}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        {documents.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowDocumentSelector(!showDocumentSelector)}
            className="flex-shrink-0"
            aria-label={t("chat.toggleDocumentSelector")}
            disabled={isLoading}
          >
            <DocumentIcon className="h-5 w-5" />
          </Button>
        )}
        
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={t("chat.messagePlaceholder")}
            className="min-h-10 py-3 resize-none"
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="button"
          onClick={isLoading ? onStop : handleSendMessage}
          disabled={isLoading ? false : !message.trim()}
          variant={isLoading ? "destructive" : "default"}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <>
              <StopIcon className="mr-2 h-4 w-4" />
              {t("chat.stop")}
            </>
          ) : (
            <>
              <SendIcon className="mr-2 h-4 w-4" />
              {t("chat.send")}
            </>
          )}
        </Button>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <div>
          {selectedDocumentIds.length > 0 && (
            <span>
              {t("chat.usingDocuments", { count: selectedDocumentIds.length })}
            </span>
          )}
        </div>
        <div>
          {t("chat.enterToSend")} · {t("chat.shiftEnterForNewline")}
        </div>
      </div>
    </div>
  );
}

// Icons
function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}