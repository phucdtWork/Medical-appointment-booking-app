"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "patient" | "doctor";
}

export default function ProtectedRoute({
  children,
  requireRole,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.role) {
      router.push("/");
      return;
    }

    if (requireRole && user.role !== requireRole) {
      router.push("/unauthorized");
      return;
    }
  }, [isLoading, isAuthenticated, user?.role, requireRole, router]);

  // Show children if authenticated and has correct role
  if (
    isAuthenticated &&
    user?.role &&
    (!requireRole || user.role === requireRole)
  ) {
    return <>{children}</>;
  }

  // Show nothing while loading or redirecting
  return null;
}
