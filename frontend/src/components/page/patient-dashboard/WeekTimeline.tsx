"use client";

import React from "react";
import { Card, Button, Empty } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";
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
  doctorId: string;
  reason: string;
  fee: number;
  doctorInfo?: {
    fullName: string;
    specialization: string;
    hospital?: string;
    avatar?: string;
  };
}

interface WeekTimelineProps {
  selectedWeek: Dayjs;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onNewAppointment?: () => void;
  isDark?: boolean;
}

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

const STATUS_COLORS = {
  pending: { bg: "#fff7e6", border: "#ffa940", text: "#d46b08" },
  confirmed: { bg: "#f6ffed", border: "#95de64", text: "#389e0d" },
  completed: { bg: "#e6f7ff", border: "#69c0ff", text: "#096dd9" },
  cancelled: { bg: "#fff1f0", border: "#ff7875", text: "#cf1322" },
};

export default function WeekTimeline({
  selectedWeek,
  appointments,
  onAppointmentClick,
  onNewAppointment,
  isDark = false,
}: WeekTimelineProps) {
  const t = useTranslations("patientDashboard");
  const startOfWeek = selectedWeek.startOf("week").add(1, "day"); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day")
  );

  // Group appointments by date and time
  const getAppointmentForSlot = (date: Dayjs, time: string) => {
    return appointments.find((apt) => {
      const aptDate = dayjs(apt.date);
      return (
        aptDate.format("YYYY-MM-DD") === date.format("YYYY-MM-DD") &&
        apt.timeSlot.start === time
      );
    });
  };

  const AppointmentBlock = ({ appointment }: { appointment: Appointment }) => {
    const color = STATUS_COLORS[appointment.status];

    return (
      <div
        onClick={() => onAppointmentClick(appointment)}
        className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
        style={{
          backgroundColor: color.bg,
          border: `2px solid ${color.border}`,
          borderRadius: "6px",
          padding: "6px 8px",
          minHeight: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: color.text,
            marginBottom: "2px",
          }}
        >
          {appointment.timeSlot.start}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#000",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {appointment.doctorInfo?.fullName || "Doctor"}
        </div>
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
          <div
            className={`text-sm mb-6 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {startOfWeek.format("D")} - {weekDays[6].format("D MMMM, YYYY")}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onNewAppointment}
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
      styles={{ body: { padding: 0 } }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr
              className={`${isDark ? "bg-slate-900" : "bg-gray-50"} border-b-2`}
              style={{ borderColor: isDark ? "#334155" : "#e5e7eb" }}
            >
              <th
                className={`py-3 px-2 text-center font-semibold text-sm ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
                style={{ width: "80px" }}
              >
                Giờ
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.format("YYYY-MM-DD")}
                  className={`py-3 px-2 text-center ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  <div className="text-xs font-normal mb-1">
                    {day.format("ddd")}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
                        ? "text-blue-500"
                        : ""
                    }`}
                  >
                    {day.format("D")}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Morning slots */}
            {TIME_SLOTS.slice(0, 6).map((time) => (
              <tr
                key={time}
                className={`border-b ${
                  isDark ? "border-slate-700" : "border-gray-100"
                }`}
              >
                <td
                  className={`py-2 px-2 text-center text-xs font-medium ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  }}
                >
                  {time}
                </td>
                {weekDays.map((day) => {
                  const appointment = getAppointmentForSlot(day, time);
                  return (
                    <td
                      key={`${day.format("YYYY-MM-DD")}-${time}`}
                      className="p-1"
                      style={{
                        backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      }}
                    >
                      {appointment ? (
                        <AppointmentBlock appointment={appointment} />
                      ) : (
                        <div style={{ minHeight: "60px" }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Lunch break */}
            <tr>
              <td
                colSpan={8}
                className={`py-3 text-center font-semibold text-sm ${
                  isDark
                    ? "bg-slate-900 text-slate-400"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                🍽️ Nghỉ trưa (11:00 - 14:00)
              </td>
            </tr>

            {/* Afternoon slots */}
            {TIME_SLOTS.slice(6).map((time) => (
              <tr
                key={time}
                className={`border-b ${
                  isDark ? "border-slate-700" : "border-gray-100"
                }`}
              >
                <td
                  className={`py-2 px-2 text-center text-xs font-medium ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  }}
                >
                  {time}
                </td>
                {weekDays.map((day) => {
                  const appointment = getAppointmentForSlot(day, time);
                  return (
                    <td
                      key={`${day.format("YYYY-MM-DD")}-${time}`}
                      className="p-1"
                      style={{
                        backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      }}
                    >
                      {appointment ? (
                        <AppointmentBlock appointment={appointment} />
                      ) : (
                        <div style={{ minHeight: "60px" }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
