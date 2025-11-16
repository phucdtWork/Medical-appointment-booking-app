// hooks/useURLFilters.ts
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Filters {
  specialization?: string;
  minRating?: number;
}

export function useURLFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [filters, setFilters] = useState<Filters>({
    specialization: searchParams.get("specialization") || undefined,
    minRating: searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined,
  });

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );

  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("pageSize") || "12")
  );

  // Sync state to URL whenever any state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (filters.specialization)
      params.set("specialization", filters.specialization);
    if (filters.minRating)
      params.set("minRating", filters.minRating.toString());
    if (viewMode !== "grid") params.set("view", viewMode);
    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (pageSize !== 12) params.set("pageSize", pageSize.toString());

    const queryString = params.toString();
    const newURL = queryString ? `/doctors?${queryString}` : "/doctors";

    // Update URL without page refresh and without scrolling
    router.replace(newURL, { scroll: false });
  }, [filters, searchTerm, viewMode, currentPage, pageSize, router]);

  // Handler functions
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const updateSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const updateViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const updatePagination = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const clearFilters = () => {
    setFilters({ specialization: undefined, minRating: undefined });
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
    // State
    filters,
    searchTerm,
    viewMode,
    currentPage,
    pageSize,
    // Handlers
    updateFilter,
    updateSearch,
    updateViewMode,
    updatePagination,
    clearFilters,
  };
}
