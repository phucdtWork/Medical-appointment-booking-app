import api from "./axios";

export interface CreateAppointmentData {
  doctorId: string;
  date: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  reason: string;
  notes?: string;
  fee: number;
}

export const appointmentAPI = {
  create: async (data: CreateAppointmentData) => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get("/appointments/my");
    return response.data;
  },

  getDoctorAppointments: async (status?: string) => {
    const response = await api.get("/appointments/doctor", {
      params: { status },
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: { status: string; doctorNotes?: string; rejectionReason?: string }
  ) => {
    const response = await api.patch(`/appointments/${id}/status`, data);
    return response.data;
  },
};
