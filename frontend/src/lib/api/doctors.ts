import api from "./axios";

export const doctorAPI = {
  getDoctors: async (filters?: {
    specialization?: string;
    minRating?: number;
  }) => {
    const response = await api.get("/doctors", { params: filters });
    return response.data;
  },

  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
};
