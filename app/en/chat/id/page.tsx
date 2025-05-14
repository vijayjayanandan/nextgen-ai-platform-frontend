// app/[locale]/chat/[id]/page.tsx
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { chatApi } from "@/lib/api/chat";
import { documentsApi } from "@/lib/api/documents";
import { ChatWindow } from "@/components/chat/chat-window";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { getTranslations } from "@/lib/i18n/server";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const conversation = await chatApi.getConversation(id);
    return {
      title: `${conversation.title.slice(0, 50)} | Chat`,
      description: "Chat conversation",
    };
  } catch (error) {
    return {
      title: "Chat",
      description: "Chat conversation",
    };
  }
}

export default async function ChatConversationPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const t = await getTranslations(locale);
  
  // Check if the user is authenticated
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");
  
  if (!accessToken) {
    // Redirect to login page if not authenticated
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/chat/${id}`);
  }
  
  // Fetch the current conversation
  let conversation;
  let conversations = [];
  let documents = [];
  
  try {
    const [conversationData, conversationsData, documentsData] = await Promise.all([
      chatApi.getConversation(id),
      chatApi.getConversations(),
      documentsApi.getDocuments({ status: "ready", limit: 20 }),
    ]);
    
    conversation = conversationData;
    conversations = conversationsData;
    documents = documentsData.documents;
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block w-80 h-full flex-shrink-0">
        <ConversationSidebar
          initialConversations={conversations}
          selectedId={id}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <h1 className="text-xl font-bold truncate">{conversation.title}</h1>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label={t("chat.toggleSidebar")}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ChatWindow
            initialMessages={conversation.messages}
            conversationId={id}
            documents={documents}
          />
        </div>
      </div>
    </div>
  );
}

// Icon
function MenuIcon({ className }: { className?: string }) {
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
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}