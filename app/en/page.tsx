// app/[locale]/page.tsx
import Link from "next/link";
import Image from "next/image";
// import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/home/feature-card";
import { RecentItems } from "@/components/home/recent-items";
import { authApi } from "@/lib/api/auth";
import { chatApi } from "@/lib/api/chat";
import { documentsApi } from "@/lib/api/documents";
import { Conversation } from "@/types/chat";
import { Document } from "@/types/document";
import { getTranslations } from "@/lib/i18n/server";

export default async function HomePage() {
  const locale = 'en'; // Hardcoded for now since we're in a static route
  const t = await getTranslations(locale);
  
  // We'll skip the authentication check for now since we're fixing the app
  // This will allow us to view the home page without being redirected to login
  
  // const cookieStore = cookies();
  // const accessToken = cookieStore.get("access_token");
  
  // if (!accessToken) {
  //   // Redirect to login page if not authenticated
  //   redirect(`/en/auth/login?callbackUrl=/en`);
  // }
  
  // Mock data for development
  let user = { name: "Test User" };
  let conversations: Conversation[] = [];
  let documents: Document[] = [];
  
  // try {
  //   const [userData, conversationsData, documentsData] = await Promise.all([
  //     authApi.getCurrentUser(),
  //     chatApi.getConversations(),
  //     documentsApi.getDocuments({ limit: 5, sort_by: "created_at", sort_order: "desc" }),
  //   ]);
    
  //   user = userData;
  //   conversations = conversationsData.slice(0, 5); // Get most recent 5
  //   documents = documentsData.documents.slice(0, 5); // Get most recent 5
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   // Continue with empty data
  // }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("home.welcome")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          {t("home.description")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={`/${locale}/chat`} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 h-12 px-6 py-3">
            {t("home.startChat")}
          </Link>
          <Link href={`/${locale}/documents`} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-primary-500 text-primary-500 hover:bg-primary-100 h-12 px-6 py-3">
            {t("home.manageDocuments")}
          </Link>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          {t("home.featuresTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title={t("home.feature1Title")}
            description={t("home.feature1Description")}
            icon={<ChatIcon className="h-6 w-6" />}
          />
          <FeatureCard
            title={t("home.feature2Title")}
            description={t("home.feature2Description")}
            icon={<DocumentIcon className="h-6 w-6" />}
          />
          <FeatureCard
            title={t("home.feature3Title")}
            description={t("home.feature3Description")}
            icon={<ShieldIcon className="h-6 w-6" />}
          />
          <FeatureCard
            title={t("home.feature4Title")}
            description={t("home.feature4Description")}
            icon={<GlobeIcon className="h-6 w-6" />}
          />
          <FeatureCard
            title={t("home.feature5Title")}
            description={t("home.feature5Description")}
            icon={<AccessibilityIcon className="h-6 w-6" />}
          />
          <FeatureCard
            title={t("home.feature6Title")}
            description={t("home.feature6Description")}
            icon={<CustomizeIcon className="h-6 w-6" />}
          />
        </div>
      </div>
      
      {/* Recent items section */}
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t("home.recentActivity")}
        </h2>
        <RecentItems conversations={conversations} documents={documents} />
      </div>
    </div>
  );
}

// Icon Components
function ChatIcon({ className }: { className?: string }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function AccessibilityIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7" r="1" />
      <path d="M9 12h6" />
      <path d="M12 12v6" />
    </svg>
  );
}

function CustomizeIcon({ className }: { className?: string }) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
