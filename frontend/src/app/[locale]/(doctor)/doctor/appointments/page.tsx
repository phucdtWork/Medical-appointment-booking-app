"use client";

import React, { useMemo, useState } from "react";
import { Card, Calendar, Empty, Skeleton } from "antd";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import { useDoctorAppointments } from "@/hooks/queries/useAppointmentsQuery";
import DoctorAppointmentDrawer from "@/components/page/doctor/appointments/DoctorAppointmentDrawer";
import DoctorFilterBar from "@/components/page/doctor/appointments/DoctorFilterBar";
import StatsCards from "@/components/page/doctor/appointments/StatsCards";
import { useTranslations } from "next-intl";
import { Appointment } from "@/types/appointment";
import { useUpdateAppointmentStatus } from "@/hooks/mutations/useAppointmentMutation";
import { useTheme } from "@/providers/ThemeProvider";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

const STATUS_COLORS = {
  pending: { bg: "#fff7e6", border: "#ffa940", text: "#d46b08" },
  confirmed: { bg: "#f6ffed", border: "#95de64", text: "#389e0d" },
  completed: { bg: "#fffbe6", border: "#ffd666", text: "#ad6800" },
  cancelled: { bg: "#fff1f0", border: "#ff7875", text: "#cf1322" },
};

// Helper: Normalize date (Firestore timestamp or ISO string to ISO string)
const normalizeDate = (date: unknown): string | null => {
  if (!date) return null;
  if (typeof date === "object" && "_seconds" in date) {
    return new Date(
      ((date as Record<string, unknown>)._seconds as number) * 1000,
    ).toISOString();
  }
  if (typeof date === "string") {
    return date;
  }
  return null;
};

export default function DoctorAppointmentsPage() {
  const t = useTranslations("doctorAppointments");
  const { data: apiData, isLoading } = useDoctorAppointments();
  const { isDark } = useTheme();

  const appointments = useMemo(
    () => (Array.isArray(apiData?.data) ? apiData.data : []),
    [apiData],
  );

  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ]); // Default: show all statuses
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentsForDay, setAppointmentsForDay] = useState<
    Appointment[] | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mutateAsync: updateStatus } = useUpdateAppointmentStatus();

  // Filter appointments by status
  const filteredAppointments = useMemo(() => {
    if (!statusFilter || statusFilter.length === 0) {
      return [];
    }
    return appointments.filter((apt) => statusFilter.includes(apt.status));
  }, [appointments, statusFilter]);

  const handleStatusFilterChange = (status: string) => {
    if (status === "") {
      setStatusFilter([]);
      return;
    }

    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Dayjs): Appointment[] => {
    return filteredAppointments.filter((apt) => {
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
        onClick={() => handleOpen(appointment)}
        className="cursor-pointer text-xs p-1 rounded mb-1 truncate hover:shadow-md"
        style={{
          backgroundColor: color.bg,
          border: `1px solid ${color.border}`,
          color: color.text,
        }}
        title={`${appointment.patientInfo?.fullName || "Patient"} - ${displayTime}`}
      >
        {displayTime} {appointment.patientInfo?.fullName || "Patient"}
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

  const handleOpen = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentsForDay([appointment]);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, data: { status } });
      setDrawerOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const bgClass = isDark
    ? "min-h-screen bg-background-dark text-white py-8"
    : "min-h-screen bg-gray-50 py-8";

  return (
    <div className={bgClass}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">{t("title")}</h2>

        {/* Stats Cards */}
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          <StatsCards
            appointments={appointments}
            selectedDate={selectedMonth}
          />
        )}

        {/* Filter Bar */}
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          <DoctorFilterBar
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            appointments={appointments}
            isDark={isDark}
          />
        )}

        {/* Calendar View */}
        {isLoading ? (
          <Card
            className={`shadow-md border-2 mt-6 ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
            style={{
              borderColor: isDark ? undefined : "var(--primary-color)",
            }}
          >
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          </Card>
        ) : appointments.length > 0 ? (
          <Card
            className={`shadow-md border-2 mt-6 ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
            style={{
              borderColor: isDark ? undefined : "var(--primary-color)",
            }}
          >
            <Calendar
              fullscreen
              value={selectedMonth}
              onChange={setSelectedMonth}
              cellRender={dateCellRender}
            />
          </Card>
        ) : (
          <Card
            className={`shadow-md border-2 mt-6 ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
            style={{
              borderColor: isDark ? undefined : "var(--primary-color)",
            }}
          >
            <Empty
              description={t("noData")}
              style={{
                color: isDark ? "#94a3b8" : "#6b7280",
              }}
            />
          </Card>
        )}

        <DoctorAppointmentDrawer
          open={drawerOpen}
          appointment={selectedAppointment}
          appointmentsForDay={appointmentsForDay}
          onClose={() => setDrawerOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
