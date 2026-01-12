"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("auth");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    // If role is null or undefined, redirect to home
    if (!isLoading && isAuthenticated && !user?.role) {
      router.push("/");
    }

    // If requireRole is specified and role doesn't match, redirect to unauthorized
    if (!isLoading && requireRole && user?.role && user.role !== requireRole) {
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, user, requireRole, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <span className="text-sm text-gray-500">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
