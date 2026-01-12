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
    queryFn: async () => {
      try {
        const response = await doctorService.getDoctors(filters);
        console.log("useDoctors response:", response);
        return response;
      } catch (error) {
        console.error("useDoctors error:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Get single doctor
export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await doctorService.getDoctorById(id);
        console.log("useDoctor response:", response);
        return response;
      } catch (error) {
        console.error("useDoctor error:", error);
        throw error;
      }
    },
    enabled: !!id, // Only run if id exists
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};
