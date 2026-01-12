import api from "../api/axios";
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
    try {
      const response = await api.get("/doctors", { params: filters });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<DoctorResponseType> => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching doctor:", error);
      throw error;
    }
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<DoctorsResponseType> => {
    try {
      const response = await api.get("/doctors/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error searching doctors:", error);
      throw error;
    }
  },
};
