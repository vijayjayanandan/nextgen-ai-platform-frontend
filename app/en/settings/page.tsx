// app/[locale]/settings/page.tsx
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { authApi } from "@/lib/api/auth";
import { getTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations(locale);
  
  // Check if the user is authenticated
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  
  if (!accessToken) {
    // Redirect to login page if not authenticated
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/settings`);
  }
  
  // Fetch user data
  let user;
  
  try {
    user = await authApi.getCurrentUser();
  } catch (error) {
    console.error("Error fetching user:", error);
    notFound();
  }
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("settings.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("settings.description")}
        </p>
      </div>
      
      <SettingsForm user={user} />
    </div>
  );
}
