"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../lib/services";

// Query keys
export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  myList: () => [...appointmentKeys.lists(), "my"] as const,
  doctorList: (status?: string) =>
    [...appointmentKeys.lists(), "doctor", status] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

// Patient: Get my appointments
export const useMyAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.myList(),
    queryFn: () => appointmentService.getMyAppointments(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Doctor: Get appointments
export const useDoctorAppointments = (status?: string) => {
  return useQuery({
    queryKey: appointmentKeys.doctorList(status),
    queryFn: () => appointmentService.getDoctorAppointments(status),
    staleTime: 1000 * 60 * 1, // 1 minute (more frequent for doctors)
  });
};

// Get single appointment
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentService.getAppointmentById(id),
    enabled: !!id,
  });
};
