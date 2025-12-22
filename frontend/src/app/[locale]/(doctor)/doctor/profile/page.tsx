"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function DoctorProfilePage() {
  const t = useTranslations?.("profile") ?? ((k: string) => k);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">
        {t("doctor.title") || "Doctor Profile"}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {t("doctor.description") || "This is the doctor profile page."}
      </p>

      {/* Placeholder content - replace with real doctor profile components */}
      <div className="mt-6 bg-white dark:bg-slate-800 border rounded-lg p-4">
        <p className="text-sm text-gray-500">
          {t("doctor.placeholder") ||
            "Doctor profile details will appear here."}
        </p>
      </div>
    </div>
  );
}
