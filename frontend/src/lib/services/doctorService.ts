import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import type {
  DoctorFilters as DoctorFiltersType,
  DoctorsResponse as DoctorsResponseType,
  DoctorResponse as DoctorResponseType,
} from "@/types/doctor";

export const doctorService = {
  // Get all doctors with filters
  getDoctors: async (
    filters?: DoctorFiltersType
  ): Promise<DoctorsResponseType> => {
    const response = await api.get("/doctors", { params: filters });
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<DoctorResponseType> => {
    const response = await api.get(`/doctors/${id}`);

    return response.data;
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<DoctorsResponse> => {
    const response = await api.get("/doctors/search", { params: { q: query } });
    return response.data;
  },
};

// React Query hooks
export const useDoctors = (filters?: any) => {
  return useQuery(["doctors", filters], () =>
    doctorService.getDoctors(filters)
  );
};

export const useDoctorById = (id?: string) => {
  return useQuery(
    ["doctor", id],
    () => doctorService.getDoctorById(id as string),
    { enabled: !!id }
  );
};
