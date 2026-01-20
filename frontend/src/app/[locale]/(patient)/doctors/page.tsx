"use client";

import { useClassName, useDoctors, useDebounce } from "@/hooks";
import DoctorFilters from "@/components/page/doctors/DoctorFilters";
import DoctorViewControls from "@/components/page/doctors/DoctorViewControls";
import DoctorList from "@/components/page/doctors/DoctorList";
import { useURLFilters } from "@/hooks/useURLFilters";
import GlobalBreadcrumb from "@/components/ui/GlobalBreadcrumb";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const t = useTranslations("doctors");

  const {
    filters,
    searchTerm,
    viewMode,
    currentPage,
    pageSize,
    updateFilter,
    updateSearch,
    updateViewMode,
    updatePagination,
    clearFilters,
  } = useURLFilters();

  const { data, isLoading, error } = useDoctors(filters);

  // Local input state to debounce user typing before updating URL/search
  const [inputValue, setInputValue] = useState<string>(searchTerm || "");
  const debouncedSearch = useDebounce(inputValue, 500);

  // When debounced value changes, propagate to URL filters
  useEffect(() => {
    if (debouncedSearch !== (searchTerm || "")) {
      updateSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local input in sync when external searchTerm changes (e.g., via URL)
  useEffect(() => {
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  // Wrapper for updateFilter to match component signature
  const handleFilterChange = (
    key: string,
    value: string | number | undefined,
  ) => {
    updateFilter(key as keyof typeof filters, value);
  };

  const filteredDoctors =
    data?.data.filter((doctor) =>
      doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const totalItems = filteredDoctors.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  return (
    <div
      className={`min-h-screen py-8 ${useClassName(
        "bg-background",
        "bg-background-dark",
      )}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <GlobalBreadcrumb />

        <div className="mb-8 mt-3">
          <h1
            className={`text-3xl mb-2.5 font-bold ${useClassName(
              "text-text-primary",
              "text-text-primary-dark",
            )}`}
          >
            {t("page.title")}
          </h1>
          <p
            className={`text-base ${useClassName(
              "text-text-secondary",
              "text-text-secondary-dark",
            )}`}
          >
            {t("page.subtitle")}
          </p>
        </div>

        <DoctorFilters
          searchTerm={inputValue}
          filters={filters}
          onSearchChange={(v: string) => setInputValue(v)}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <DoctorViewControls
          totalItems={totalItems}
          viewMode={viewMode}
          onViewModeChange={updateViewMode}
        />

        <DoctorList
          doctors={paginatedDoctors}
          isLoading={isLoading}
          error={error}
          viewMode={viewMode}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPaginationChange={updatePagination}
        />
      </div>
    </div>
  );
}
