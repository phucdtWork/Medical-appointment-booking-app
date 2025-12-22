"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/lib/services/appointmentService";

export default function useAppointmentEvents() {
  const qc = useQueryClient();

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${base.replace(/\/$/, "")}/appointments/stream`;

    let es: EventSource | null = null;
    try {
      es = new EventSource(url, {} as EventSourceInit);
    } catch (err) {
      console.error("Failed to create EventSource", err);
      return;
    }

    const onAppointment = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        // For simplicity, invalidate both patient and doctor lists so UI updates
        qc.invalidateQueries({ queryKey: appointmentKeys.myList() });
        qc.invalidateQueries({ queryKey: appointmentKeys.doctorList() });
      } catch (err) {
        console.error("Failed to parse appointment SSE", err);
      }
    };

    es.addEventListener("appointment", onAppointment as EventListener);

    es.onopen = () => {
      // console.log("Appointment SSE connected", url);
    };

    es.onerror = (err) => {
      console.error("Appointment SSE error", err);
      // try reconnect logic: EventSource auto-reconnects by default
    };

    return () => {
      if (es) {
        es.removeEventListener("appointment", onAppointment as EventListener);
        es.close();
      }
    };
  }, [qc]);
}
