// components/settings/settings-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "@/lib/i18n/client";
import { User, UserPreferences } from "@/types/auth";

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const { t, locale, changeLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: theme as "light" | "dark" | "system",
    language: locale as "en" | "fr",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update the form when the theme or locale changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      theme: theme as "light" | "dark" | "system",
      language: locale as "en" | "fr",
    }));
  }, [theme, locale]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      // Set the theme and language
      setTheme(preferences.theme);
      
      if (preferences.language !== locale) {
        changeLocale(preferences.language);
      }
      
      // Here you would typically update the preferences on the server
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSuccess(true);
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("settings.updateError")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-300">
          {t("settings.saved")}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-md text-accent-700 dark:text-accent-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t("settings.appearance")}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("settings.theme")}
              </label>
              <select
                id="theme"
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as "light" | "dark" | "system" })}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="light">{t("settings.lightTheme")}</option>
                <option value="dark">{t("settings.darkTheme")}</option>
                <option value="system">{t("settings.systemTheme")}</option>
              </select>
            </div>
            
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("settings.language")}
              </label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value as "en" | "fr" })}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t("settings.account")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("settings.name")}
              </label>
              <input
                id="name"
                type="text"
                value={user.name}
                disabled
                className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("settings.contactAdmin")}
              </p>
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("settings.email")}
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t("settings.security")}
          </h2>
          
          <Button
            type="button"
            variant="outline"
          >
            {t("settings.changePassword")}
          </Button>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t("settings.accessibility")}
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="highContrast"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
              />
              <label
                htmlFor="highContrast"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                {t("settings.highContrast")}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="reduceMotion"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
              />
              <label
                htmlFor="reduceMotion"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                {t("settings.reduceMotion")}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="largeText"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
              />
              <label
                htmlFor="largeText"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                {t("settings.largeText")}
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="submit"
            loading={isLoading}
          >
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}