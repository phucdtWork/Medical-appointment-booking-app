"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/providers/NotificationProvider";
import { useTranslations } from "next-intl";
import {
  appointmentService,
  CreateAppointmentData,
  UpdateAppointmentStatusData,
} from "../../lib/services";
import { appointmentKeys } from "../queries/useAppointmentsQuery";

// Create appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("patientDashboard.notifications");

  return useMutation({
    mutationFn: (data: CreateAppointmentData) =>
      appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.myList() });
      notification.success({
        message: t("created") || "Thành công",
        description:
          t("createdDescription") ||
          "Đặt lịch thành công, chờ bác sĩ xác nhận.",
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage = error.response?.data?.error || t("error") || "Lỗi";
      notification.error({
        message: t("error") || "Lỗi",
        description: errorMessage,
      });
    },
  });
};

// Update appointment status (Doctor)
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("patientDashboard.notifications");

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentStatusData;
    }) => appointmentService.updateAppointmentStatus(id, data),
    onSuccess: (_, variables) => {
      // Invalidate doctor lists for all status filters so UI refreshes regardless
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.lists(),
      });

      const successMessage =
        variables.data.status === "confirmed"
          ? t("confirmed") || "Đã xác nhận lịch hẹn"
          : t("rejected") || "Đã từ chối lịch hẹn";

      notification.success({
        message: successMessage,
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage = error.response?.data?.error || t("error") || "Lỗi";
      notification.error({
        message: t("error") || "Lỗi",
        description: errorMessage,
      });
    },
  });
};

// Cancel appointment (Patient)
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("patientDashboard.notifications");

  return useMutation({
    mutationFn: (id: string) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      // Invalidate patient's appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.myList() });
      notification.success({
        message: t("cancelled") || "Đã hủy lịch hẹn",
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage = error.response?.data?.error || t("error") || "Lỗi";
      notification.error({
        message: t("error") || "Lỗi",
        description: errorMessage,
      });
    },
  });
};

// Reschedule appointment (Patient)
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("patientDashboard.notifications");

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { date: string; timeSlot: { start: string; end: string } };
    }) => appointmentService.rescheduleAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.myList() });
      notification.success({
        message: t("rescheduled") || "Đã dời lịch hẹn",
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage = error.response?.data?.error || t("error") || "Lỗi";
      notification.error({
        message: t("error") || "Lỗi",
        description: errorMessage,
      });
    },
  });
};
