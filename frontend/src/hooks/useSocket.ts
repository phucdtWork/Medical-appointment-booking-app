import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}

// Hook để watch doctor slots real-time
export function useWatchDoctorSlots(doctorId: string | null) {
  const { socket, isConnected } = useSocket();
  const [slotUpdates, setSlotUpdates] = useState<any>(null);

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
