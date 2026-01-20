import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Set the socket in state after it's initialized
    setSocket(socketRef.current);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket,
    isConnected,
  };
}

// Hook để watch doctor slots real-time
interface SlotUpdate {
  docId: string;
  availableSlots: unknown[];
  timestamp: number;
}

export function useWatchDoctorSlots(doctorId: string | null) {
  const { socket, isConnected } = useSocket();
  const [slotUpdates, setSlotUpdates] = useState<SlotUpdate | null>(null);

  useEffect(() => {
    if (!socket || !doctorId || !isConnected) return;

    socket.emit("watch:doctor:slots", doctorId);

    socket.on("slot:status:changed", (data) => {
      console.log("Slot status changed:", data);
      setSlotUpdates(data);
    });

    socket.on("slot:booked", (data) => {
      console.log("Slot booked:", data);
      setSlotUpdates({ ...data, isBooked: true });
    });

    socket.on("schedule:updated", (data) => {
      console.log("Schedule updated:", data);
      setSlotUpdates({ type: "schedule_updated", ...data });
    });

    // Cleanup
    return () => {
      socket.emit("unwatch:doctor:slots", doctorId);
      socket.off("slot:status:changed");
      socket.off("slot:booked");
      socket.off("schedule:updated");
    };
  }, [socket, doctorId, isConnected]);

  return {
    socket,
    isConnected,
    slotUpdates,
  };
}

// ==================== APPOINTMENT REAL-TIME HOOKS ====================

// Hook for doctor to listen to appointment updates
export interface AppointmentUpdate {
  appointmentId: string;
  appointment: Record<string, unknown>;
  timestamp: Date;
}

export function useAppointmentUpdates(
  userId: string | null,
  userRole: string | null,
) {
  const { socket, isConnected } = useSocket();
  const [appointmentUpdate, setAppointmentUpdate] =
    useState<AppointmentUpdate | null>(null);
  const [newAppointment, setNewAppointment] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<AppointmentUpdate | null>(
    null,
  );
  const [rescheduleUpdate, setRescheduleUpdate] =
    useState<AppointmentUpdate | null>(null);
  const [cancelUpdate, setCancelUpdate] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Join/leave appointment room based on user role and ID
  useEffect(() => {
    if (!socket || !userId || !isConnected) return;

    if (userRole === "doctor") {
      socket.emit("join:doctor:appointments", userId);
      console.log("Joined doctor appointments room");

      return () => {
        socket.emit("leave:doctor:appointments", userId);
      };
    } else if (userRole === "patient") {
      socket.emit("join:patient:appointments", userId);
      console.log("Joined patient appointments room");

      return () => {
        socket.emit("leave:patient:appointments", userId);
      };
    }
  }, [socket, userId, userRole, isConnected]);

  // Listen for appointment events
  useEffect(() => {
    if (!socket) return;

    // New appointment created (for doctor)
    socket.on("appointment:created", (data) => {
      console.log("New appointment created:", data);
      setNewAppointment(data.appointment);
      setAppointmentUpdate({
        appointmentId: data.appointment.id,
        appointment: data.appointment,
        timestamp: data.timestamp,
      });
    });

    // Appointment status updated
    socket.on("appointment:status:updated", (data) => {
      console.log("Appointment status updated:", data);
      setStatusUpdate({
        appointmentId: data.appointmentId,
        appointment: data.appointment,
        timestamp: data.timestamp,
      });
      setAppointmentUpdate({
        appointmentId: data.appointmentId,
        appointment: data.appointment,
        timestamp: data.timestamp,
      });
    });

    // Appointment rescheduled
    socket.on("appointment:rescheduled", (data) => {
      console.log("Appointment rescheduled:", data);
      setRescheduleUpdate({
        appointmentId: data.appointmentId,
        appointment: data.appointment,
        timestamp: data.timestamp,
      });
      setAppointmentUpdate({
        appointmentId: data.appointmentId,
        appointment: data.appointment,
        timestamp: data.timestamp,
      });
    });

    // Appointment cancelled
    socket.on("appointment:cancelled", (data) => {
      console.log("Appointment cancelled:", data);
      setCancelUpdate({
        appointmentId: data.appointmentId,
        cancelledBy: data.cancelledBy,
        reason: data.reason,
        timestamp: data.timestamp,
      });
      setAppointmentUpdate({
        appointmentId: data.appointmentId,
        appointment: {} as Record<string, unknown>,
        timestamp: data.timestamp,
      });
    });

    // Cleanup
    return () => {
      socket.off("appointment:created");
      socket.off("appointment:status:updated");
      socket.off("appointment:rescheduled");
      socket.off("appointment:cancelled");
    };
  }, [socket]);

  return {
    socket,
    isConnected,
    appointmentUpdate,
    newAppointment,
    statusUpdate,
    rescheduleUpdate,
    cancelUpdate,
  };
}
