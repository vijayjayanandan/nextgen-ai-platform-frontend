// app/[locale]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, locale } = useTranslation();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);
  
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-accent-600 dark:text-accent-400">
        {t("errors.serverError")}
      </h1>
      <div className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-md">
        <p>{t("errors.serverErrorMessage")}</p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-md text-accent-700 dark:text-accent-300 text-left overflow-auto max-h-32">
            <p className="font-mono text-sm break-all">{error.message}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex space-x-4">
        <Button onClick={reset}>{t("common.retry")}</Button>
        <Button variant="outline" asChild>
          <Link href={`/${locale}`}>{t("errors.goHome")}</Link>
        </Button>
      </div>
      
      {error.digest && (
        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          {t("errors.errorId")}: {error.digest}
        </p>
      )}
    </div>
  );
}