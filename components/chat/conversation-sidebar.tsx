// components/chat/conversation-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/types/chat";
import { chatApi } from "@/lib/api/chat";
import { useTranslation } from "@/lib/i18n/client";
import { formatDate } from "@/lib/utils";

interface ConversationSidebarProps {
  initialConversations: Conversation[];
  selectedId?: string;
}

export function ConversationSidebar({
  initialConversations,
  selectedId,
}: ConversationSidebarProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Refresh conversations when path changes
  useEffect(() => {
    if (pathname === `/${locale}/chat`) {
      fetchConversations();
    }
  }, [pathname, locale]);
  
  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("chat.conversationError")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = async () => {
    router.push(`/${locale}/chat`);
  };
  
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(t("chat.deleteConfirmation"))) {
      return;
    }
    
    try {
      await chatApi.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      
      // If the deleted conversation is the current one, redirect to /chat
      if (id === selectedId) {
        router.push(`/${locale}/chat`);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("chat.deleteError")
      );
    }
  };
  
  const startRenameConversation = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingId(id);
    setEditTitle(currentTitle);
  };
  
  const handleRenameConversation = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editTitle.trim()) {
      return;
    }
    
    try {
      const updated = await chatApi.updateConversationTitle(id, editTitle);
      setConversations(
        conversations.map((c) => (c.id === id ? { ...c, title: updated.title } : c))
      );
      setIsEditingId(null);
    } catch (err) {
      console.error("Error renaming conversation:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("chat.renameError")
      );
    }
  };
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
          variant="secondary"
        >
          <PlusIcon className="h-4 w-4" />
          {t("chat.newChat")}
        </Button>
      </div>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Input
          type="search"
          placeholder={t("common.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t("chat.conversationHistory")}
        </h2>
        
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {t("common.loading")}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-accent-500">
            {error}
            <Button
              variant="link"
              onClick={fetchConversations}
              className="mt-2 text-accent-600 dark:text-accent-400"
            >
              {t("common.retry")}
            </Button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery
              ? t("chat.noSearchResults")
              : t("chat.noConversations")}
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                {isEditingId === conversation.id ? (
                  <form
                    onSubmit={(e) => handleRenameConversation(conversation.id, e)}
                    className="p-2"
                  >
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      onBlur={() => setIsEditingId(null)}
                      className="mb-1"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingId(null)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!editTitle.trim()}
                      >
                        {t("common.save")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Link
                    href={`/${locale}/chat/${conversation.id}`}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      selectedId === conversation.id
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex-1 truncate">
                      <div className="truncate font-medium">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(conversation.updated_at, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={(e) =>
                          startRenameConversation(
                            conversation.id,
                            conversation.title,
                            e
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label={t("chat.renameConversation")}
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteConversation(conversation.id, e)
                        }
                        className="p-1 text-gray-500 hover:text-accent-500 dark:text-gray-400 dark:hover:text-accent-400"
                        aria-label={t("chat.deleteConversation")}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}