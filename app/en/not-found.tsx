// app/[locale]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = "en"; // Hardcoded for now since we're in a static route
  const t = await getTranslations(locale);
  
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <h2 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
        {t("errors.pageNotFound")}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {t("errors.pageNotFoundMessage")}
      </p>
      
      <div className="mt-8 flex space-x-4">
        <Button asChild>
          <Link href={`/${locale}`}>{t("errors.goHome")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/help`}>{t("nav.help")}</Link>
        </Button>
      </div>
    </div>
  );
}
