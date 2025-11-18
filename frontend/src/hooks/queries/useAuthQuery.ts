"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../lib/services";
import { useRouter } from "next/navigation";
import { useNotification } from "@/providers/NotificationProvider";

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
    staleTime: Infinity,
  });

  // Logout
  const logout = () => {
    authService.logout();
    queryClient.clear();
    notification.success({ message: "Đã đăng xuất" });
    router.push("/login");
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  // Check role
  const hasRole = (role: "patient" | "doctor") => user?.role === role;

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
