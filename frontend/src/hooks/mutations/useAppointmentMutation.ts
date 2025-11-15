"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  appointmentService,
  CreateAppointmentData,
  UpdateAppointmentStatusData,
} from "../../lib/services";
import { appointmentKeys } from "../queries/useAppointmentsQuery";

// Create appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentData) =>
      appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.myList() });
      message.success("Đặt lịch thành công! Chờ bác sĩ xác nhận.");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Đặt lịch thất bại";
      message.error(errorMessage);
    },
  });
};

// Update appointment status (Doctor)
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentStatusData;
    }) => appointmentService.updateAppointmentStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.doctorList(),
      });

      const successMessage =
        variables.data.status === "confirmed"
          ? "Đã xác nhận lịch hẹn"
          : "Đã từ chối lịch hẹn";

      message.success(successMessage);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Cập nhật thất bại";
      message.error(errorMessage);
    },
  });
};

// Cancel appointment (Patient)
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      // Invalidate patient's appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.myList() });
      message.success("Đã hủy lịch hẹn");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Hủy lịch thất bại";
      message.error(errorMessage);
    },
  });
};
