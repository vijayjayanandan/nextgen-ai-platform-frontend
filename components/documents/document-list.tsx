// components/documents/document-list.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document, DocumentStatus } from "@/types/document";
import { documentsApi } from "@/lib/api/documents";
import { useTranslation } from "@/lib/i18n/client";
import { formatDate, formatFileSize } from "@/lib/utils";

interface DocumentListProps {
  initialDocuments: Document[];
  onDocumentSelect?: (document: Document) => void;
  selectable?: boolean;
  selectedIds?: string[];
  refreshTrigger?: number;
}

export function DocumentList({
  initialDocuments,
  onDocumentSelect,
  selectable = false,
  selectedIds = [],
  refreshTrigger = 0,
}: DocumentListProps) {
  const { t, locale } = useTranslation();
  
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [sortBy, setSortBy] = useState<
    "created_at" | "title" | "size"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Fetch documents when refresh trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchDocuments();
    }
  }, [refreshTrigger]);
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: Record<string, any> = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      
      if (searchQuery) {
        params.query = searchQuery;
      }
      
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      const response = await documentsApi.getDocuments(params);
      setDocuments(response.documents);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("documents.fetchError")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("documents.deleteConfirmation"))) {
      return;
    }
    
    try {
      await documentsApi.deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("documents.deleteError")
      );
    }
  };
  
  // Toggle sort order when clicking the same column
  const handleSortChange = (column: "created_at" | "title" | "size") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };
  
  // Apply client-side filtering for instant feedback
  const filteredDocuments = documents.filter((doc) => {
    if (statusFilter !== "all" && doc.status !== statusFilter) {
      return false;
    }
    
    if (
      searchQuery &&
      !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Apply client-side sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === "created_at") {
      return sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === "size") {
      return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
    }
    return 0;
  });
  
  // Status badge styles
  const getStatusBadgeClass = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.READY:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case DocumentStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case DocumentStatus.ERROR:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Classification badge styles
  const getClassificationBadgeClass = (classification: string) => {
    switch (classification) {
      case "public":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "protected_a":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "protected_b":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "protected_c":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <Input
            type="search"
            placeholder={t("documents.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </form>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "all")}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-950"
          >
            <option value="all">{t("documents.allStatuses")}</option>
            <option value={DocumentStatus.READY}>{t("documents.ready")}</option>
            <option value={DocumentStatus.PROCESSING}>
              {t("documents.processing")}
            </option>
            <option value={DocumentStatus.ERROR}>{t("documents.error")}</option>
          </select>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchDocuments}
          >
            {t("common.refresh")}
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-md bg-accent-50 text-accent-700 border border-accent-200">
          {error}
          <Button
            variant="link"
            onClick={fetchDocuments}
            className="text-accent-700 underline ml-2"
          >
            {t("common.retry")}
          </Button>
        </div>
      )}
      
      {/* Documents table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-3 py-3.5">
                  {/* Header cell for checkboxes */}
                </th>
              )}
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSortChange("title")}
              >
                <div className="flex items-center">
                  {t("documents.titleLabel")}
                  {sortBy === "title" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {t("documents.type")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {t("documents.securityClassification")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {t("documents.status")}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSortChange("size")}
              >
                <div className="flex items-center">
                  {t("documents.size")}
                  {sortBy === "size" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSortChange("created_at")}
              >
                <div className="flex items-center">
                  {t("documents.uploadDate")}
                  {sortBy === "created_at" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
            {isLoading ? (
              <tr>
                <td
                  colSpan={selectable ? 8 : 7}
                  className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {t("common.loading")}
                </td>
              </tr>
            ) : sortedDocuments.length === 0 ? (
              <tr>
                <td
                  colSpan={selectable ? 8 : 7}
                  className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {searchQuery
                    ? t("documents.noSearchResults")
                    : t("documents.noDocuments")}
                </td>
              </tr>
            ) : (
              sortedDocuments.map((document) => (
                <tr
                  key={document.id}
                  className={
                    selectable && selectedIds.includes(document.id)
                      ? "bg-primary-50 dark:bg-primary-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  }
                >
                  {selectable && (
                    <td className="w-12 pl-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
                        checked={selectedIds.includes(document.id)}
                        onChange={() => {
                          if (onDocumentSelect) {
                            onDocumentSelect(document);
                          }
                        }}
                        disabled={document.status !== DocumentStatus.READY}
                      />
                    </td>
                  )}
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <Link
                        href={`/${locale}/documents/${document.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        {document.title || document.filename}
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {document.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {document.content_type.split("/")[1]?.toUpperCase() ||
                      document.content_type}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getClassificationBadgeClass(
                        document.metadata.security_classification
                      )}`}
                    >
                      {document.metadata.security_classification === "public"
                        ? t("documents.public")
                        : document.metadata.security_classification === "protected_a"
                        ? t("documents.protectedA")
                        : document.metadata.security_classification === "protected_b"
                        ? t("documents.protectedB")
                        : t("documents.protectedC")}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        document.status
                      )}`}
                    >
                      {document.status === DocumentStatus.READY
                        ? t("documents.ready")
                        : document.status === DocumentStatus.PROCESSING
                        ? t("documents.processing")
                        : t("documents.error")}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(document.size)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(document.created_at)}
                  </td>
                  <td className="px-3 py-4 text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      className="text-accent-500 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
                    >
                      {t("common.delete")}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}