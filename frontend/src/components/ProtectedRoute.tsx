"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";

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
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (!isLoading && requireRole && user?.role !== requireRole) {
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, user, requireRole, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang xác thực..." />
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
