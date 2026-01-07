import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Appointment as AppointmentType,
  AppointmentList as AppointmentListType,
} from "@/types/appointment";

export type Appointment = AppointmentType;

export interface CreateAppointmentData {
  doctorId: string;
  date: string; // ISO date string
  timeSlot: {
    start: string;
    end: string;
  };
  reason: string;
  notes?: string;
  fee?: number;
}

export interface UpdateAppointmentStatusData {
  status: string;
  doctorNotes?: string;
  rejectionReason?: string;
}

export interface AppointmentsResponse {
  success: boolean;
  count?: number;
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
    const response = await api.put(`/appointments/${id}`, {
      action: "cancel",
    });
    return response.data;
  },

  // Reschedule appointment (Patient)
  rescheduleAppointment: async (
    id: string,
    data: { date: string; timeSlot: { start: string; end: string } }
  ): Promise<AppointmentResponse> => {
    const response = await api.put(`/appointments/${id}`, {
      action: "reschedule",
      date: data.date,
      timeSlot: data.timeSlot,
    });
    return response.data;
  },
};

// React Query hooks
export const appointmentKeys = {
  myList: () => ["appointments", "me"],
  doctorList: () => ["appointments", "doctor"],
  detail: (id: string) => ["appointment", id],
};

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: CreateAppointmentData) => appointmentService.createAppointment(data),
    {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
    }
  );
};

export const useMyAppointments = () => {
  return useQuery(appointmentKeys.myList(), () =>
    appointmentService.getMyAppointments()
  );
};

export const useDoctorAppointments = (status?: string) => {
  return useQuery(appointmentKeys.doctorList(), () =>
    appointmentService.getDoctorAppointments(status)
  );
};

export const useAppointment = (id?: string) => {
  return useQuery(
    id ? appointmentKeys.detail(id) : ["appointment", "none"],
    () => appointmentService.getAppointmentById(id as string),
    { enabled: !!id }
  );
};

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: UpdateAppointmentStatusData }) =>
      appointmentService.updateAppointmentStatus(id, data),
    {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: appointmentKeys.doctorList() }),
    }
  );
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation((id: string) => appointmentService.cancelAppointment(id), {
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
  });
};

export const useRescheduleAppointment = () => {
  const qc = useQueryClient();
  return useMutation(
    ({
      id,
      data,
    }: {
      id: string;
      data: { date: string; timeSlot: { start: string; end: string } };
    }) => appointmentService.rescheduleAppointment(id, data),
    {
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
    }
  );
};
