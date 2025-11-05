import api from "../api/axios";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  patientNotes?: string;
  doctorNotes?: string;
  rejectionReason?: string;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
  patientInfo?: any;
  doctorInfo?: any;
}

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

export interface UpdateAppointmentStatusData {
  status: string;
  doctorNotes?: string;
  rejectionReason?: string;
}

export interface AppointmentsResponse {
  success: boolean;
  count: number;
  data: Appointment[];
}

export interface AppointmentResponse {
  success: boolean;
  data: Appointment;
}

export const appointmentService = {
  // Create appointment (Patient)
  createAppointment: async (
    data: CreateAppointmentData
  ): Promise<AppointmentResponse> => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  // Get patient's appointments
  getMyAppointments: async (): Promise<AppointmentsResponse> => {
    const response = await api.get("/appointments/my");
    return response.data;
  },

  // Get doctor's appointments
  getDoctorAppointments: async (
    status?: string
  ): Promise<AppointmentsResponse> => {
    const response = await api.get("/appointments/doctor", {
      params: { status },
    });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status (Doctor)
  updateAppointmentStatus: async (
    id: string,
    data: UpdateAppointmentStatusData
  ): Promise<AppointmentResponse> => {
    const response = await api.patch(`/appointments/${id}/status`, data);
    return response.data;
  },

  // Cancel appointment (Patient)
  cancelAppointment: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.patch(`/appointments/${id}/status`, {
      status: "cancelled",
    });
    return response.data;
  },
};
