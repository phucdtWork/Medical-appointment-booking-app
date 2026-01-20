"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../lib/services";
import { useRouter } from "next/navigation";
import { useNotification } from "@/providers/NotificationProvider";
import { useMemo, useEffect } from "react";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Get current user
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notification = useNotification();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const response = await authService.getMe();
        return response.data;
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log(err);

        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: typeof window !== "undefined", // Only fetch on client side
  });

  // Logout
  const logout = () => {
    // Clear auth immediately without waiting for notification
    authService.logout();
    // Only invalidate auth queries, not everything
    queryClient.invalidateQueries({ queryKey: authKeys.all });
    queryClient.removeQueries({ queryKey: authKeys.all });

    // Show notification and redirect immediately
    // Note: Cannot use useTranslations here as this is not a React component
    // Using English fallback for logout success message
    notification.success({ message: "Logged out successfully" });
    router.push("/login");
  };

  // Listen for storage changes (e.g., when Google login sets token)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue) {
        // Token was set - refetch auth data
        refetch();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetch]);

  // Also listen for same-tab changes (storage event only fires across tabs)
  // Use a custom event when token is set in localStorage
  useEffect(() => {
    const handleTokenSet = () => {
      refetch();
    };

    window.addEventListener("auth:token-set", handleTokenSet);
    return () => window.removeEventListener("auth:token-set", handleTokenSet);
  }, [refetch]);

  // Memoize computed values to avoid unnecessary re-renders
  const isAuthenticated = useMemo(
    () => !!user && !!localStorage.getItem("token"),
    [user],
  );

  // Check role
  const hasRole = useMemo(
    () => (role: "patient" | "doctor") => user?.role === role,
    [user?.role],
  );

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    hasRole,
    logout,
    refetch,
  };
};
