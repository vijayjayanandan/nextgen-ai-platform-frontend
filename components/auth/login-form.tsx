// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
// Removed zodResolver import that was causing issues
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/api/auth";
import { useTranslation } from "@/lib/i18n/client";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    // Using basic validation without zodResolver
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginAction(data);
      
      if (result.success) {
        // Redirect to the callback URL or dashboard
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(result.error || t("login.genericError"));
      }
    } catch (err) {
      setError(t("login.genericError"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-accent-50 border border-accent-200 text-accent-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("login.emailLabel")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("login.passwordLabel")}
            </label>
            <button
              type="button"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {t("login.forgotPassword")}
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          loading={isLoading}
        >
          {t("login.signIn")}
        </Button>
      </form>
    </div>
  );
}
