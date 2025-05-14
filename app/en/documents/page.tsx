// app/[locale]/documents/page.tsx
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DocumentList } from "@/components/documents/document-list";
import { DocumentUpload } from "@/components/documents/document-upload";
import { documentsApi } from "@/lib/api/documents";
import { getTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Documents",
  description: "Manage your documents for AI processing",
};

export default async function DocumentsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations(locale);
  
  // Check if the user is authenticated
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");
  
  if (!accessToken) {
    // Redirect to login page if not authenticated
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/documents`);
  }
  
  // Fetch initial documents
  let documents = [];
  
  try {
    const response = await documentsApi.getDocuments({
      sort_by: "created_at",
      sort_order: "desc",
    });
    documents = response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    // Continue with empty documents array
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("documents.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("documents.description")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document upload form */}
        <div className="lg:col-span-1">
          <DocumentUpload onSuccess={() => {}} />
        </div>
        
        {/* Document list */}
        <div className="lg:col-span-2">
          <DocumentList initialDocuments={documents} />
        </div>
      </div>
    </div>
  );
}