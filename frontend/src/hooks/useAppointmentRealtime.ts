import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./queries/useAuthQuery";
import { useAppointmentUpdates } from "./useSocket";
import { useNotification } from "@/providers/NotificationProvider";

/**
 * Hook to handle real-time appointment updates and automatically refetch data
 * Listens to Socket.io events and updates React Query cache + shows notifications
 */
export function useAppointmentRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const notification = useNotification();
  const {
    appointmentUpdate,
    newAppointment,
    statusUpdate,
    rescheduleUpdate,
    cancelUpdate,
  } = useAppointmentUpdates(user?.id, user?.role);

  // Refetch appointment data when new appointment is created
  useEffect(() => {
    if (!newAppointment || user?.role !== "doctor") return;

    console.log("New appointment created, refreshing doctor appointments...");

    // Refetch doctor appointments
    queryClient.invalidateQueries({ queryKey: ["appointments", "doctor"] });

    const patientName =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newAppointment.patientInfo as Record<string, any> | undefined)
        ?.fullName || "Patient";

    // Show notification
    notification.success({
      message: "New Appointment",
      description: `${patientName} booked an appointment`,
      duration: 5,
    });
  }, [newAppointment, user?.role, queryClient, notification]);

  // Refetch appointment data when status is updated
  useEffect(() => {
    if (!statusUpdate) return;

    console.log("Appointment status updated, refreshing...");

    // Refetch appointments based on user role
    const queryKey =
      user?.role === "doctor"
        ? ["appointments", "doctor"]
        : ["appointments", "patient"];

    queryClient.invalidateQueries({ queryKey });

    // Update specific appointment in cache
    queryClient.invalidateQueries({
      queryKey: ["appointment", statusUpdate.appointmentId],
    });

    // Show notification based on status
    const statusMessages: Record<string, string> = {
      confirmed: "Appointment confirmed",
      completed: "Appointment completed",
      rejected: "Appointment rejected",
      cancelled: "Appointment cancelled",
    };

    const status =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (statusUpdate.appointment as Record<string, any>)?.status || "updated";
    const message = statusMessages[status] || `Appointment ${status}`;

    notification.info({
      message: "Appointment Update",
      description: message,
      duration: 4,
    });
  }, [statusUpdate, user?.role, queryClient, notification]);

  // Refetch appointment data when rescheduled
  useEffect(() => {
    if (!rescheduleUpdate) return;

    console.log("Appointment rescheduled, refreshing...");

    // Refetch appointments
    const queryKey =
      user?.role === "doctor"
        ? ["appointments", "doctor"]
        : ["appointments", "patient"];

    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({
      queryKey: ["appointment", rescheduleUpdate.appointmentId],
    });

    notification.info({
      message: "Appointment Rescheduled",
      description: "Appointment has been rescheduled to a new date and time",
      duration: 4,
    });
  }, [rescheduleUpdate, user?.role, queryClient, notification]);

  // Refetch appointment data when cancelled
  useEffect(() => {
    if (!cancelUpdate) return;

    console.log("Appointment cancelled, refreshing...");

    // Refetch appointments
    const queryKey =
      user?.role === "doctor"
        ? ["appointments", "doctor"]
        : ["appointments", "patient"];

    queryClient.invalidateQueries({ queryKey });
    queryClient.removeQueries({
      queryKey: ["appointment", cancelUpdate.appointmentId],
    });

    notification.warning({
      message: "Appointment Cancelled",
      description: `Appointment was cancelled${cancelUpdate.reason ? `: ${cancelUpdate.reason}` : ""}`,
      duration: 4,
    });
  }, [cancelUpdate, user?.role, queryClient, notification]);

  return {
    appointmentUpdate,
    newAppointment,
    statusUpdate,
    rescheduleUpdate,
    cancelUpdate,
  };
}
