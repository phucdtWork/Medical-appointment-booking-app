"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorService, DoctorFilters } from "../../lib/services";

// Query keys
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (filters?: DoctorFilters) => [...doctorKeys.lists(), filters] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
};

// Get all doctors with filters
export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorService.getDoctors(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single doctor
export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id, // Only run if id exists
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
