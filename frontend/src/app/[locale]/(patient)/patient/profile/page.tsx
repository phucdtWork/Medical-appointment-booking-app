"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function PatientProfilePage() {
  const t = useTranslations?.("profile") ?? ((k: string) => k);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">
        {t("patient.title") || "Patient Profile"}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {t("patient.description") || "This is the patient profile page."}
      </p>

      {/* Placeholder content - replace with real profile components */}
      <div className="mt-6 bg-white dark:bg-slate-800 border rounded-lg p-4">
        <p className="text-sm text-gray-500">
          {t("patient.placeholder") || "Profile details will appear here."}
        </p>
      </div>
    </div>
  );
}
