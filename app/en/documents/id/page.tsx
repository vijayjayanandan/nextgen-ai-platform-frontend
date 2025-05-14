// app/[locale]/documents/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { documentsApi } from "@/lib/api/documents";
import { getTranslations } from "@/lib/i18n/server";
import { formatDate, formatFileSize } from "@/lib/utils";
import { DocumentStatus } from "@/types/document";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const document = await documentsApi.getDocument(id);
    return {
      title: `${document.title || document.filename} | Documents`,
      description: `Document details for ${document.title || document.filename}`,
    };
  } catch (error) {
    return {
      title: "Document Details",
      description: "Document details page",
    };
  }
}

export default async function DocumentDetailPage({
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
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/documents/${id}`);
  }
  
  // Fetch document details
  let document;
  let documentContent = null;
  
  try {
    document = await documentsApi.getDocument(id);
    
    // Only try to get content if document is ready
    if (document.status === DocumentStatus.READY) {
      try {
        documentContent = await documentsApi.getDocumentContent(id);
      } catch (contentError) {
        console.error("Error fetching document content:", contentError);
        // Continue without content
      }
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    notFound();
  }
  
  // Function to render the security classification badge
  const renderSecurityBadge = (classification: string) => {
    let badgeClass = "";
    let label = "";
    
    switch (classification) {
      case "public":
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        label = t("documents.public");
        break;
      case "protected_a":
        badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        label = t("documents.protectedA");
        break;
      case "protected_b":
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        label = t("documents.protectedB");
        break;
      case "protected_c":
        badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        label = t("documents.protectedC");
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        label = classification;
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
        {label}
      </span>
    );
  };
  
  // Function to render the document status badge
  const renderStatusBadge = (status: DocumentStatus) => {
    let badgeClass = "";
    let label = "";
    
    switch (status) {
      case DocumentStatus.READY:
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        label = t("documents.ready");
        break;
      case DocumentStatus.PROCESSING:
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        label = t("documents.processing");
        break;
      case DocumentStatus.ERROR:
        badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        label = t("documents.error");
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        label = status;
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
        {label}
      </span>
    );
  };
  
  // Function to get the document type icon based on content type
  const getDocumentIcon = () => {
    const contentType = document.content_type.toLowerCase();
    
    if (contentType.includes("pdf")) {
      return <PdfIcon className="h-12 w-12 text-red-500" />;
    } else if (contentType.includes("word") || contentType.includes("document")) {
      return <WordIcon className="h-12 w-12 text-blue-500" />;
    } else if (contentType.includes("excel") || contentType.includes("spreadsheet")) {
      return <ExcelIcon className="h-12 w-12 text-green-500" />;
    } else if (contentType.includes("powerpoint") || contentType.includes("presentation")) {
      return <PowerPointIcon className="h-12 w-12 text-orange-500" />;
    } else if (contentType.includes("text") || contentType.includes("plain")) {
      return <TextIcon className="h-12 w-12 text-gray-500" />;
    } else {
      return <DocumentIcon className="h-12 w-12 text-gray-500" />;
    }
  };
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href={`/${locale}/documents`} className="hover:text-primary-500">
          {t("documents.title")}
        </Link>
        <span>/</span>
        <span className="truncate max-w-xs">{document.title || document.filename}</span>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document metadata */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center mb-4">
              {getDocumentIcon()}
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {document.title || document.filename}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {document.filename}
                </p>
              </div>
            </div>
            
            <dl className="grid grid-cols-1 gap-4 mt-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("documents.status")}
                </dt>
                <dd className="mt-1">{renderStatusBadge(document.status)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("documents.securityClassification")}
                </dt>
                <dd className="mt-1">
                  {renderSecurityBadge(document.metadata.security_classification)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("documents.size")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatFileSize(document.size)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("documents.uploadDate")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(document.created_at, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("documents.type")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {document.content_type}
                </dd>
              </div>
              
              {document.metadata.tags && document.metadata.tags.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("documents.tagsLabel")}
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {document.metadata.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            
            <div className="mt-6 flex flex-col space-y-3">
              <Button variant="default" size="sm" asChild>
                <Link href={`/${locale}/chat?document=${document.id}`}>
                  {t("documents.chatWithDocument")}
                </Link>
              </Button>
              
              <Button variant="outline" size="sm">
                {t("documents.download")}
              </Button>
              
              <Button variant="destructive" size="sm">
                {t("documents.deleteDocument")}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Document content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {t("documents.documentContent")}
            </h2>
            
            {document.status === DocumentStatus.PROCESSING ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {t("documents.processingDocument")}
                </p>
              </div>
            ) : document.status === DocumentStatus.ERROR ? (
              <div className="bg-accent-50 dark:bg-accent-900/10 border border-accent-200 dark:border-accent-800 rounded-md p-4 text-accent-700 dark:text-accent-400">
                <h3 className="text-sm font-medium">{t("documents.processingError")}</h3>
                <p className="mt-2 text-sm">
                  {t("documents.processingErrorDescription")}
                </p>
              </div>
            ) : documentContent ? (
              <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-gray-50 dark:bg-gray-950">
                <pre className="whitespace-pre-wrap break-words">{documentContent}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("documents.contentNotAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon Components
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

function PdfIcon({ className }: { className?: string }) {
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
      <path d="M9 15v-4h2a2 2 0 1 1 0 4H9Z"/>
      <path d="M14 15v-2a2 2 0 1 1 4 0v2"/>
      <path d="M16 13h2"/>
      <path d="M7 15h1"/>
    </svg>
  );
}

function WordIcon({ className }: { className?: string }) {
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
      <path d="M8 12h8" />
      <path d="M8 16h8" />
      <path d="M8 20h5" />
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
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
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

function PowerPointIcon({ className }: { className?: string }) {
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
      <circle cx="10" cy="13" r="2" />
      <path d="M10 15v3" />
      <path d="M14 12h2v6" />
    </svg>
  );
}

function TextIcon({ className }: { className?: string }) {
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
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="11" y2="9" />
    </svg>
  );
}