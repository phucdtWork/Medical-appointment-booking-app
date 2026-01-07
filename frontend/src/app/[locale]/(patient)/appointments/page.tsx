"use client";

import React, { useState, useMemo } from "react";
import { Card, Empty, Skeleton } from "antd";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import StatsCards from "@/components/page/patient-dashboard/StatsCards";
import FilterBar from "@/components/page/patient-dashboard/FilterBar";
import WeekCalendar from "@/components/page/patient-dashboard/WeekCalendar";
import WeekTimeline from "@/components/page/patient-dashboard/WeekTimeline";
import AppointmentDrawer from "@/components/page/patient-dashboard/AppointmentDrawer";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { useMyAppointments } from "@/hooks/queries/useAppointmentsQuery";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

import type { Appointment } from "@/types/appointment";

type PatientDashboardPropsPartial = {
  onReschedule?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  onViewDoctor?: (doctorId: string) => void;
  isDark?: boolean;
};

export default function PatientDashboard({
  onReschedule,
  onCancel,
  onViewDoctor,
}: PatientDashboardPropsPartial) {
  const { isDark } = useTheme();
  const t = useTranslations("patientDashboard");

  // Fetch appointments from API
  const { data: apiData, isLoading } = useMyAppointments();

  const appointments = useMemo(
    () => (Array.isArray(apiData?.data) ? apiData.data : []),
    [apiData]
  );

  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs());
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAppointments = useMemo(() => {
    const appts = Array.isArray(appointments) ? appointments : [];

    let filtered = [...appts];

    if (statusFilter.length > 0) {
      filtered = filtered.filter((apt) => statusFilter.includes(apt.status));
    }

    const startOfWeek = selectedWeek.startOf("week");
    const endOfWeek = selectedWeek.endOf("week");

    filtered = filtered.filter((apt) => {
      const aptDate = dayjs(apt.date);
      return (
        aptDate.isSameOrAfter(startOfWeek, "day") &&
        aptDate.isSameOrBefore(endOfWeek, "day")
      );
    });

    return filtered;
  }, [appointments, statusFilter, selectedWeek]);

  const handleStatusFilterChange = (status: string) => {
    if (status === "") {
      setStatusFilter([]);
      return;
    }

    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [status]
    );
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleStatsCardClick = (type: "upcoming" | "today" | "pending") => {
    if (type === "today") {
      setSelectedWeek(dayjs());
      setStatusFilter([]);
    } else if (type === "pending") {
      setStatusFilter(["pending"]);
    } else if (type === "upcoming") {
      setSelectedWeek(dayjs());
      setStatusFilter([]);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 transition-colors
         ${isDark ? "bg-background-dark " : "bg-[#f5f5f5] "}
        `}
    >
      <div className="max-w-7xl mx-auto  ">
        <StatsCards
          appointments={appointments}
          onCardClick={handleStatsCardClick}
          isDark={isDark}
        />

        <WeekCalendar
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          appointments={appointments}
          isDark={isDark}
        />

        <Card
          className={`shadow-md border-2 ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
          style={{
            borderColor: isDark ? undefined : "var(--primary-color)",
          }}
        >
          <div className="flex flex-col gap-4">
            <FilterBar
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              appointments={filteredAppointments}
              isDark={isDark}
            />
          </div>
        </Card>

        {isLoading ? (
          <Card
            className={`shadow-md border-2 ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
            style={{ borderColor: isDark ? undefined : "var(--primary-color)" }}
          >
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </Card>
        ) : filteredAppointments.length > 0 ? (
          <WeekTimeline
            selectedWeek={selectedWeek}
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
            isDark={isDark}
          />
        ) : (
          <Card
            className={`shadow-md border-2 ${
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

        <AppointmentDrawer
          open={drawerOpen}
          appointment={selectedAppointment}
          onClose={() => setDrawerOpen(false)}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onViewDoctor={onViewDoctor}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
