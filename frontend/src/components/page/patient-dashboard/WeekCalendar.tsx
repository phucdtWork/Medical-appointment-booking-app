"use client";

import React from "react";
import { Card, Button, Space } from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useTranslations } from "next-intl";

dayjs.locale("vi");

interface Appointment {
  id: string;
  date: string | Date;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  timeSlot: {
    start: string;
    end: string;
  };
}

interface WeekCalendarProps {
  selectedWeek: Dayjs;
  onWeekChange: (week: Dayjs) => void;
  appointments: Appointment[];
  onDateSelect?: (date: Dayjs) => void;
  isDark?: boolean;
}

const STATUS_COLORS = {
  pending: "#faad14",
  confirmed: "#52c41a",
  completed: "#1890ff",
  cancelled: "#ff4d4f",
  rejected: "#ff4d4f",
};

export default function WeekCalendar({
  selectedWeek,
  onWeekChange,
  appointments,
  onDateSelect,
  isDark = false,
}: WeekCalendarProps) {
  const t = useTranslations("patientDashboard");
  const tStatus = useTranslations("patientDashboard.status");
  const startOfWeek = selectedWeek.startOf("week").add(1, "day"); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day")
  );

  const today = dayjs();

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Dayjs) => {
    return appointments.filter((apt) => {
      const aptDate = dayjs(apt.date);
      return aptDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
    });
  };

  // Check if date is today
  const isToday = (date: Dayjs) => {
    return date.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");
  };

  return (
    <Card
      className={`${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
      title={
        <div className="flex items-center justify-between">
          <span
            className={`text-lg font-semibold flex items-center gap-2 ${
              isDark ? "text-slate-200" : "text-gray-800"
            }`}
          >
            <CalendarOutlined /> {t("weekNavigation.week")}{" "}
            {selectedWeek.week()} - {selectedWeek.format("MMMM YYYY")}
          </span>
          <Space>
            <Button
              icon={<LeftOutlined />}
              onClick={() => onWeekChange(selectedWeek.subtract(1, "week"))}
              size="small"
              className={isDark ? "border-slate-600" : ""}
            />
            <Button
              onClick={() => onWeekChange(dayjs())}
              size="small"
              className={isDark ? "border-slate-600" : ""}
            >
              Hôm nay
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={() => onWeekChange(selectedWeek.add(1, "week"))}
              size="small"
              className={isDark ? "border-slate-600" : ""}
            />
          </Space>
        </div>
      }
      styles={{ body: { padding: "16px" } }}
    >
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentDay = isToday(day);
          const isPast = day.isBefore(today, "day");

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              onClick={() => onDateSelect?.(day)}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                hover:shadow-md hover:scale-105
                ${
                  isCurrentDay
                    ? isDark
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-blue-500 bg-blue-50"
                    : isDark
                      ? "border-slate-700 bg-slate-900/50"
                      : "border-gray-200 bg-white"
                }
                ${isPast && !isCurrentDay ? "opacity-60" : ""}
              `}
            >
              {/* Day name */}
              <div
                className={`text-xs font-medium text-center mb-1 ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                {day.format("ddd")}
              </div>

              {/* Date number */}
              <div
                className={`text-2xl font-bold text-center mb-2 ${
                  isCurrentDay
                    ? "text-blue-600"
                    : isDark
                      ? "text-slate-200"
                      : "text-gray-800"
                }`}
              >
                {day.format("D")}
              </div>

              {/* Appointment indicators */}
              <div className="flex flex-col gap-1 min-h-[40px]">
                {dayAppointments.length > 0 ? (
                  <>
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="flex items-center gap-1">
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: STATUS_COLORS[apt.status],
                            flexShrink: 0,
                          }}
                        />
                        <span
                          className={`text-xs truncate ${
                            isDark ? "text-slate-400" : "text-gray-600"
                          }`}
                        >
                          {apt.timeSlot.start}
                        </span>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div
                        className={`text-xs text-center font-medium ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        +{dayAppointments.length - 3} lịch
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`text-xs text-center ${
                      isDark ? "text-slate-600" : "text-gray-400"
                    }`}
                  >
                    Trống
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: STATUS_COLORS.pending,
            }}
          />
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}
          >
            {tStatus("pending")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: STATUS_COLORS.confirmed,
            }}
          />
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}
          >
            {tStatus("confirmed")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: STATUS_COLORS.completed,
            }}
          />
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}
          >
            {tStatus("completed")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: STATUS_COLORS.cancelled,
            }}
          />
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}
          >
            {tStatus("cancelled")}
          </span>
        </div>
      </div>
    </Card>
  );
}
