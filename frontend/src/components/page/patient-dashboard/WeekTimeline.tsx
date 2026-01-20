"use client";

import React from "react";
import { Card, Button, Calendar } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useTranslations, useLocale } from "next-intl";
import type { Appointment } from "@/types/appointment";
import { useRouter } from "next/navigation";

dayjs.locale("vi");

interface WeekTimelineProps {
  selectedWeek: Dayjs;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onNewAppointment?: () => void;
  isDark?: boolean;
}

const STATUS_COLORS = {
  pending: {
    bg: "#fff7e6",
    border: "#ffa940",
    text: "#d46b08",
    color: "orange",
  },
  confirmed: {
    bg: "#f6ffed",
    border: "#95de64",
    text: "#389e0d",
    color: "green",
  },
  completed: {
    bg: "#fffbe6",
    border: "#ffd666",
    text: "#ad6800",
    color: "gold",
  },
  cancelled: {
    bg: "#fff1f0",
    border: "#ff7875",
    text: "#cf1322",
    color: "red",
  },
  rejected: {
    bg: "#fff1f0",
    border: "#ff7875",
    text: "#cf1322",
    color: "red",
  },
};

// Helper: Normalize date (Firestore timestamp or ISO string to ISO string)
const normalizeDate = (date: unknown): string | null => {
  if (!date) return null;
  if (typeof date === "object" && "_seconds" in date) {
    return new Date((date._seconds as number) * 1000).toISOString();
  }
  if (typeof date === "string") {
    return date;
  }
  return null;
};

export default function WeekTimeline({
  selectedWeek,
  appointments,
  onAppointmentClick,
  isDark = false,
}: WeekTimelineProps) {
  const t = useTranslations("patientDashboard");
  const locale = useLocale();
  const router = useRouter();

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Dayjs): Appointment[] => {
    return appointments.filter((apt) => {
      const normalizedDate = normalizeDate(apt.date);
      if (!normalizedDate) return false;
      const dateStr = normalizedDate.split("T")[0];
      const aptDate = dayjs(dateStr);
      return aptDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
    });
  };

  const AppointmentBlock = ({ appointment }: { appointment: Appointment }) => {
    const color = STATUS_COLORS[appointment.status];
    const normalizedDate = normalizeDate(appointment.date);
    const displayTime = normalizedDate
      ? dayjs(normalizedDate).format("HH:mm")
      : "N/A";

    return (
      <div
        onClick={() => onAppointmentClick(appointment)}
        className="cursor-pointer text-xs p-1 rounded mb-1 truncate hover:shadow-md"
        style={{
          backgroundColor: color.bg,
          border: `1px solid ${color.border}`,
          color: color.text,
        }}
        title={`${appointment.doctorInfo?.fullName || "Doctor"} - ${displayTime}`}
      >
        {displayTime} {appointment.doctorInfo?.fullName || "Doctor"}
      </div>
    );
  };

  // Render cell content with appointments
  const dateCellRender = (date: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(date);
    return (
      <div className="space-y-0.5">
        {dayAppointments.map((apt) => (
          <AppointmentBlock key={apt.id} appointment={apt} />
        ))}
      </div>
    );
  };

  // Empty state
  if (appointments.length === 0) {
    return (
      <Card
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="text-center py-12">
          <CalendarOutlined
            style={{ fontSize: 64, color: isDark ? "#475569" : "#d9d9d9" }}
          />
          <div
            className={`text-lg mt-4 mb-2 ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            {t("noData")}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push(`/${locale}/doctors`)}
            size="large"
          >
            {t("weekNavigation.newAppointment")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <Calendar
        value={selectedWeek}
        fullscreen
        cellRender={dateCellRender}
        style={{
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#e2e8f0" : "#000000",
        }}
      />
    </Card>
  );
}
