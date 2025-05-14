// hooks/use-auth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

interface UseAuthProps {
  required?: boolean;
  redirectTo?: string;
  queryParams?: Record<string, string>;
}

export function useAuth({
  required = false,
  redirectTo = "/auth/login",
  queryParams = {},
}: UseAuthProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadUser() {
      try {
        // Fetch the current user from the API
        const response = await fetch("/api/auth/me");
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated
            if (required) {
              // Add query params to redirectTo
              const params = new URLSearchParams({
                callbackUrl: window.location.pathname,
                ...queryParams,
              });
              const redirectUrl = `${redirectTo}?${params.toString()}`;
              router.push(redirectUrl);
            }
            setUser(null);
          } else {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
          }
        } else {
          const userData = await response.json();
          setUser(userData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsLoading(false);
        
        if (required) {
          // Add query params to redirectTo
          const params = new URLSearchParams({
            callbackUrl: window.location.pathname,
            ...queryParams,
          });
          const redirectUrl = `${redirectTo}?${params.toString()}`;
          router.push(redirectUrl);
        }
      }
    }
    
    loadUser();
  }, [required, redirectTo, queryParams, router]);
  
  return { user, isLoading, error };
}