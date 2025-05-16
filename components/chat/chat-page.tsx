// components/chat/chat-page.tsx
"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "./chat-window";
import { ConversationSidebar } from "./conversation-sidebar";
import type { Conversation } from "@/types/chat";
import type { Document } from "@/types/document";
import { DocumentStatus } from "@/types/document";
import { ChatApi } from "@/lib/api/chat";
import { DocumentsApi } from "@/lib/api/documents";
import { MenuIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n/client";

export default function ChatPageClient() {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const chatApi = new ChatApi();
  const documentsApi = new DocumentsApi();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [conversationsData, documentsData] = await Promise.all([
          chatApi.getConversations(),
          documentsApi.getDocuments({ status: DocumentStatus.READY, limit: 20 }),
        ]);
        setConversations(conversationsData);
        setDocuments(documentsData.documents);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block w-80 h-full flex-shrink-0">
        <ConversationSidebar initialConversations={conversations} />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <h1 className="text-xl font-bold">{t("chat.newChat")}</h1>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label={t("chat.toggleSidebar")}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ChatWindow documents={documents} />
        </div>
      </div>
    </div>
  );
}
