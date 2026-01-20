import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Appointment as AppointmentType } from "@/types/appointment";
import dayjs from "dayjs";

export type Appointment = AppointmentType;

// Helper function to normalize dates from Firestore format
const normalizeDateField = (
  date: Record<string, unknown> | string | Date | undefined,
): string => {
  if (!date) return new Date().toISOString();

  // If it's already a string, return it
  if (typeof date === "string") return date;

  // If it's a Firestore timestamp object { _seconds, _nanoseconds }
  if (typeof date === "object" && "_seconds" in date) {
    return new Date((date._seconds as number) * 1000).toISOString();
  }

  // If it's already a Date object
  if (date instanceof Date) return date.toISOString();

  // Try to parse with dayjs as fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = dayjs(date as any);
  if (parsed.isValid()) return parsed.toISOString();

  return new Date().toISOString();
};

// Helper function to normalize appointment data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeAppointment = (apt: Record<string, unknown>): Appointment => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(apt as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    date: normalizeDateField(apt.date as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: normalizeDateField(apt.createdAt as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedAt: normalizeDateField(apt.updatedAt as any),
  };
};

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
    data: CreateAppointmentData,
  ): Promise<AppointmentResponse> => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  // Get patient's appointments
  getMyAppointments: async (): Promise<AppointmentsResponse> => {
    const response = await api.get("/appointments/my");
    return {
      ...response.data,
      data: Array.isArray(response.data.data)
        ? response.data.data.map(normalizeAppointment)
        : [],
    };
  },

  // Get doctor's appointments
  getDoctorAppointments: async (
    status?: string,
  ): Promise<AppointmentsResponse> => {
    const response = await api.get("/appointments/doctor", {
      params: { status },
    });
    return {
      ...response.data,
      data: Array.isArray(response.data.data)
        ? response.data.data.map(normalizeAppointment)
        : [],
    };
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.get(`/appointments/${id}`);
    return {
      ...response.data,
      data: normalizeAppointment(response.data.data),
    };
  },

  // Update appointment status (Doctor)
  updateAppointmentStatus: async (
    id: string,
    data: UpdateAppointmentStatusData,
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
    data: { date: string; timeSlot: { start: string; end: string } },
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
  return useMutation({
    mutationFn: (data: CreateAppointmentData) =>
      appointmentService.createAppointment(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
  });
};

export const useMyAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.myList(),
    queryFn: () => appointmentService.getMyAppointments(),
  });
};

export const useDoctorAppointments = (status?: string) => {
  return useQuery({
    queryKey: appointmentKeys.doctorList(),
    queryFn: () => appointmentService.getDoctorAppointments(status),
  });
};

export const useAppointment = (id?: string) => {
  return useQuery({
    queryKey: id ? appointmentKeys.detail(id) : ["appointment", "none"],
    queryFn: () => appointmentService.getAppointmentById(id as string),
    enabled: !!id,
  });
};

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentStatusData;
    }) => appointmentService.updateAppointmentStatus(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.doctorList() }),
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
  });
};

export const useRescheduleAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { date: string; timeSlot: { start: string; end: string } };
    }) => appointmentService.rescheduleAppointment(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: appointmentKeys.myList() }),
  });
};
