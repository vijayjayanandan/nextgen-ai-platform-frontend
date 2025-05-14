// components/documents/document-upload.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documentsApi } from "@/lib/api/documents";
import { useTranslation } from "@/lib/i18n/client";
import { formatFileSize } from "@/lib/utils";

interface DocumentUploadProps {
  onSuccess: () => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [securityClassification, setSecurityClassification] = useState<string>("protected_b");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (selectedFile.size > maxSize) {
      setError(t("documents.fileTooLarge"));
      return;
    }
    
    // List of accepted file types
    const acceptedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/csv",
      "application/json",
      "application/xml",
      "text/markdown",
    ];
    
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError(t("documents.fileTypeNotSupported"));
      return;
    }
    
    setFile(selectedFile);
    // Use the file name as the default title if title is empty
    if (!title) {
      setTitle(selectedFile.name.split(".")[0]); // Remove file extension
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError(t("documents.noFileSelected"));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      
      await documentsApi.uploadDocument(file, {
        title: title || file.name,
        security_classification: securityClassification,
        tags: formattedTags,
      });
      
      // Reset form
      setFile(null);
      setTitle("");
      setTags("");
      setSecurityClassification("protected_b");
      
      // Notify parent of success
      onSuccess();
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("documents.uploadError")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-4">{t("documents.uploadDocument")}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-accent-50 border border-accent-200 text-accent-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleUpload} className="space-y-4">
        {/* File drop area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragging
                ? "border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20"
                : "border-gray-300 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-600"
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.xml,.md"
          />
          
          {file ? (
            <div className="space-y-2">
              <DocumentIcon className="mx-auto h-10 w-10 text-primary-500" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                {t("common.remove")}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("documents.dragDropHere")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PDF, Word, Excel, PowerPoint, Text, CSV, JSON, XML, Markdown (Max 20MB)
              </p>
            </div>
          )}
        </div>
        
        {/* Document metadata */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("documents.titleLabel")}
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder={t("documents.titlePlaceholder")}
            />
          </div>
          
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("documents.tagsLabel")}
            </label>
            <Input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1"
              placeholder={t("documents.tagsPlaceholder")}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("documents.tagsHelp")}
            </p>
          </div>
          
          <div>
            <label
              htmlFor="security"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("documents.classificationLabel")}
            </label>
            <select
              id="security"
              value={securityClassification}
              onChange={(e) => setSecurityClassification(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="public">{t("documents.public")}</option>
              <option value="protected_a">{t("documents.protectedA")}</option>
              <option value="protected_b">{t("documents.protectedB")}</option>
              <option value="protected_c">{t("documents.protectedC")}</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" loading={isLoading} disabled={!file}>
            {t("documents.uploadDocument")}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Icons
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

function UploadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}