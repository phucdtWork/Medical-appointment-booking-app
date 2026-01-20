"use client";

import React from "react";
import { Space, Button, Tag, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useTranslations } from "next-intl";

dayjs.locale("vi");

const { Text } = Typography;

interface Appointment {
  id: string;
  status: string;
}

interface DoctorFilterBarProps {
  selectedMonth: Dayjs;
  onMonthChange: (month: Dayjs) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  appointments: Appointment[];
  isDark?: boolean;
}

export default function DoctorFilterBar({
  selectedMonth,
  onMonthChange,
  statusFilter,
  onStatusFilterChange,
  appointments,
  isDark = false,
}: DoctorFilterBarProps) {
  const t = useTranslations("doctorAppointments");
  const tStatus = useTranslations("patientDashboard.status");
  const tWeekNav = useTranslations("patientDashboard.weekNavigation");

  // Calculate status counts
  const statusCounts = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const isActive = (status: string) => statusFilter.includes(status);

  return (
    <div
      className={`p-4 rounded-lg mb-6 ${
        isDark
          ? "bg-slate-800 border border-slate-700"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      {/* Month Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <Space size="middle">
          <Button
            onClick={() => onMonthChange(selectedMonth.subtract(1, "month"))}
            className={isDark ? "border-slate-600" : ""}
          >
            ←
          </Button>
          <Text
            strong
            className={`text-base ${
              isDark ? "text-slate-200" : "text-gray-800"
            }`}
          >
            {selectedMonth.format("MMMM YYYY")}
          </Text>
          <Button
            onClick={() => onMonthChange(selectedMonth.add(1, "month"))}
            className={isDark ? "border-slate-600" : ""}
          >
            →
          </Button>
          <Button
            onClick={() => onMonthChange(dayjs())}
            className={isDark ? "border-slate-600" : ""}
          >
            {t("today")}
          </Button>
        </Space>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Text className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
          {tStatus("label")}:
        </Text>

        <Tag
          color={
            isActive("pending") ? "orange" : isDark ? "default" : "default"
          }
          onClick={() => onStatusFilterChange("pending")}
          className={`cursor-pointer select-none ${
            isActive("pending") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("pending") ? 2 : 1,
            padding: "4px 12px",
            color: isActive("pending")
              ? undefined
              : isDark
                ? "#64748b"
                : "#6b7280",
          }}
        >
          {tStatus("pending")} ({statusCounts.pending})
        </Tag>

        <Tag
          color={
            isActive("confirmed") ? "green" : isDark ? "default" : "default"
          }
          onClick={() => onStatusFilterChange("confirmed")}
          className={`cursor-pointer select-none ${
            isActive("confirmed") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("confirmed") ? 2 : 1,
            padding: "4px 12px",
            color: isActive("confirmed")
              ? undefined
              : isDark
                ? "#64748b"
                : "#6b7280",
          }}
        >
          {tStatus("confirmed")} ({statusCounts.confirmed})
        </Tag>

        <Tag
          color={
            isActive("completed") ? "gold" : isDark ? "default" : "default"
          }
          onClick={() => onStatusFilterChange("completed")}
          className={`cursor-pointer select-none ${
            isActive("completed") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("completed") ? 2 : 1,
            padding: "4px 12px",
            color: isActive("completed")
              ? undefined
              : isDark
                ? "#64748b"
                : "#6b7280",
          }}
        >
          {tStatus("completed")} ({statusCounts.completed})
        </Tag>

        <Tag
          color={isActive("cancelled") ? "red" : isDark ? "default" : "default"}
          onClick={() => onStatusFilterChange("cancelled")}
          className={`cursor-pointer select-none ${
            isActive("cancelled") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("cancelled") ? 2 : 1,
            padding: "4px 12px",
            color: isActive("cancelled")
              ? undefined
              : isDark
                ? "#64748b"
                : "#6b7280",
          }}
        >
          {tStatus("cancelled")} ({statusCounts.cancelled})
        </Tag>

        {statusFilter.length > 0 && statusFilter.length < 4 && (
          <Button
            type="link"
            size="small"
            onClick={() => onStatusFilterChange("")}
            className={isDark ? "text-blue-400" : ""}
          >
            {tWeekNav("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
