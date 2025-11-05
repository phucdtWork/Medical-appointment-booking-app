import api from "../api/axios";

export interface Doctor {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "doctor";
  avatar?: string;
  doctorInfo: {
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    education: string[];
    hospital: string;
    consultationFee: {
      min: number;
      max: number;
    };
    bio: string;
    rating: number;
    totalReviews: number;
    totalPatients: number;
  };
}

export interface DoctorFilters {
  specialization?: string;
  minRating?: number;
  search?: string;
}

export interface DoctorsResponse {
  success: boolean;
  count: number;
  data: Doctor[];
}

export interface DoctorResponse {
  success: boolean;
  data: Doctor;
}

export const doctorService = {
  // Get all doctors with filters
  getDoctors: async (filters?: DoctorFilters): Promise<DoctorsResponse> => {
    const response = await api.get("/doctors", { params: filters });
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<DoctorResponse> => {
    const response = await api.get(`/doctors/${id}`);

    return response.data;
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<DoctorsResponse> => {
    const response = await api.get("/doctors/search", { params: { q: query } });
    return response.data;
  },
};
