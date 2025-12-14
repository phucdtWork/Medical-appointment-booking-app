"use client";

import React from "react";
import { Space, Button, Tag, Typography } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useTranslations } from "next-intl";

dayjs.locale("vi");

const { Text } = Typography;

interface Appointment {
  id: string;
  status: string;
}

interface FilterBarProps {
  selectedWeek: Dayjs;
  onWeekChange: (week: Dayjs) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
  appointments: Appointment[];
  onNewAppointment?: () => void;
  isDark?: boolean;
}

export default function FilterBar({
  selectedWeek,
  onWeekChange,
  statusFilter,
  onStatusFilterChange,
  appointments,
  onNewAppointment,
  isDark = false,
}: FilterBarProps) {
  const t = useTranslations("patientDashboard.weekNavigation");
  const tStatus = useTranslations("patientDashboard.status");

  // Calculate status counts
  const statusCounts = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const startOfWeek = selectedWeek.startOf("week").add(1, "day"); // Monday
  const endOfWeek = selectedWeek.endOf("week").add(1, "day"); // Sunday

  const isActive = (status: string) => statusFilter.includes(status);

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        isDark
          ? "bg-slate-800 border border-slate-700"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      {/* Week Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <Space size="middle">
          <Button
            icon={<LeftOutlined />}
            onClick={() => onWeekChange(selectedWeek.subtract(1, "week"))}
            className={isDark ? "border-slate-600" : ""}
          />
          <Text
            strong
            className={`text-base ${
              isDark ? "text-slate-200" : "text-gray-800"
            }`}
          >
            {t("week")} {selectedWeek.week()}: {startOfWeek.format("D")} -{" "}
            {endOfWeek.format("D MMMM, YYYY")}
          </Text>
          <Button
            icon={<RightOutlined />}
            onClick={() => onWeekChange(selectedWeek.add(1, "week"))}
            className={isDark ? "border-slate-600" : ""}
          />
          <Button
            onClick={() => onWeekChange(dayjs())}
            className={isDark ? "border-slate-600" : ""}
          >
            {t("today")}
          </Button>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onNewAppointment}
          style={{ backgroundColor: "#1890ff" }}
        >
          {t("newAppointment")}
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Text className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
          {tStatus("label")}:
        </Text>

        <Tag
          color={isActive("pending") ? "orange" : "default"}
          onClick={() => onStatusFilterChange("pending")}
          className={`cursor-pointer select-none ${
            isActive("pending") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("pending") ? 2 : 1,
            padding: "4px 12px",
          }}
        >
          {tStatus("pending")} ({statusCounts.pending})
        </Tag>

        <Tag
          color={isActive("confirmed") ? "green" : "default"}
          onClick={() => onStatusFilterChange("confirmed")}
          className={`cursor-pointer select-none ${
            isActive("confirmed") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("confirmed") ? 2 : 1,
            padding: "4px 12px",
          }}
        >
          {tStatus("confirmed")} ({statusCounts.confirmed})
        </Tag>

        <Tag
          color={isActive("completed") ? "blue" : "default"}
          onClick={() => onStatusFilterChange("completed")}
          className={`cursor-pointer select-none ${
            isActive("completed") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("completed") ? 2 : 1,
            padding: "4px 12px",
          }}
        >
          {tStatus("completed")} ({statusCounts.completed})
        </Tag>

        <Tag
          color={isActive("cancelled") ? "red" : "default"}
          onClick={() => onStatusFilterChange("cancelled")}
          className={`cursor-pointer select-none ${
            isActive("cancelled") ? "font-semibold" : ""
          }`}
          style={{
            borderWidth: isActive("cancelled") ? 2 : 1,
            padding: "4px 12px",
          }}
        >
          {tStatus("cancelled")} ({statusCounts.cancelled})
        </Tag>

        {statusFilter.length > 0 && (
          <Button
            type="link"
            size="small"
            onClick={() => onStatusFilterChange("")}
            className={isDark ? "text-blue-400" : ""}
          >
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
