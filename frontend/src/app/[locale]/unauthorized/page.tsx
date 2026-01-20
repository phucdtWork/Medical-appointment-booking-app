"use client";
import React from "react";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const t = useTranslations?.("unauthorized") ?? ((k: string) => k);
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 ${
        isDark ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-md border ${
          isDark
            ? "bg-slate-800 border-slate-700 text-slate-100"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-2">{t("title")}</h1>
        <p
          className={`text-sm mb-6 ${isDark ? "text-slate-300" : "text-gray-600"}`}
        >
          {t("message")}
        </p>

        <div className="flex justify-end">
          <Button type="primary" onClick={() => router.push("/")}>
            {t("backHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
