// app/en/chat/page.tsx
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatPageClient from "@/components/chat/chat-page";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with the AI assistant",
};

export default async function ChatPage() {
  // Check if the user is authenticated
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  
  if (!accessToken) {
    redirect(`/en/auth/login`);
  }

  return <ChatPageClient />;
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
