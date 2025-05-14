// components/home/recent-items.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Conversation } from "@/types/chat";
import { Document } from "@/types/document";
import { useTranslation } from "@/lib/i18n/client";
import { formatDate } from "@/lib/utils";

interface RecentItemsProps {
  conversations: Conversation[];
  documents: Document[];
}

export function RecentItems({ conversations, documents }: RecentItemsProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<"conversations" | "documents">("conversations");
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("conversations")}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === "conversations"
                ? "text-primary-600 border-b-2 border-primary-500 dark:text-primary-400 dark:border-primary-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {t("home.recentConversations")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === "documents"
                ? "text-primary-600 border-b-2 border-primary-500 dark:text-primary-400 dark:border-primary-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {t("home.recentDocuments")}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === "conversations" ? (
          conversations.length > 0 ? (
            <ul className="space-y-2">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    href={`/${locale}/chat/${conversation.id}`}
                    className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conversation.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(conversation.updated_at, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {conversation.messages[conversation.messages.length - 1]?.content.slice(0, 100) || "..."}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t("home.noConversations")}
              </p>
              <Link
                href={`/${locale}/chat`}
                className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t("home.startNewChat")}
              </Link>
            </div>
          )
        ) : documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((document) => (
              <li key={document.id}>
                <Link
                  href={`/${locale}/documents/${document.id}`}
                  className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {document.title || document.filename}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(document.created_at, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                      {document.content_type.split("/")[1]?.toUpperCase() || document.content_type}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{document.metadata.security_classification}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {t("home.noDocuments")}
            </p>
            <Link
              href={`/${locale}/documents`}
              className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {t("home.uploadDocument")}
            </Link>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 text-right">
        <Link
          href={`/${locale}/${activeTab === "conversations" ? "chat" : "documents"}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {activeTab === "conversations" ? t("home.viewAllConversations") : t("home.viewAllDocuments")} →
        </Link>
      </div>
    </div>
  );
}