// app/[locale]/auth/login/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { getTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Login | Government AI Platform",
  description: "Log in to access the Government AI Platform",
};

export default async function LoginPage() {
  const locale = 'en'; // Hardcoded for now since we're in a static route
  const t = await getTranslations(locale);
  
  return (
    <div className="flex min-h-screen w-full flex-col justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex justify-center mb-6">
            <Image
              src="/images/government-logo.svg"
              alt="Government of Canada Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("login.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("login.description")}
          </p>
        </div>
        
        <LoginForm />
        
        <p className="px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {t("login.privacyPolicy")}
          </Link>
          {" | "}
          <Link
            href="/terms-of-service"
            className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {t("login.termsOfService")}
          </Link>
        </p>
      </div>
    </div>
  );
}
