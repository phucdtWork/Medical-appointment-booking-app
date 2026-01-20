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

// Helper: Convert Firestore timestamp or ISO string to ISO string
const normalizeDate = (date: unknown): string | null => {
  if (!date) return null;
  // If it's Firestore timestamp object
  if (typeof date === "object" && "_seconds" in date) {
    return new Date(date._seconds * 1000).toISOString();
  }
  // If it's already ISO string
  if (typeof date === "string") {
    return date;
  }
  return null;
};

export default function PatientDashboard() {
  const { isDark } = useTheme();
  const t = useTranslations("patientDashboard");

  // Fetch appointments from API
  const { data: apiData, isLoading } = useMyAppointments();

  const appointments = useMemo(() => {
    if (!Array.isArray(apiData?.data)) return [];
    // Normalize dates: convert Firestore timestamp to ISO string
    return apiData.data.map((apt: Appointment) => ({
      ...apt,
      date: normalizeDate(apt.date),
    }));
  }, [apiData]);

  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs());
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ]); // Default: show all statuses
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

    setStatusFilter(
      (prev) =>
        prev.includes(status)
          ? prev.filter((s) => s !== status)
          : [...prev, status], // Add to existing filters, not replace
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
              appointments={appointments}
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
