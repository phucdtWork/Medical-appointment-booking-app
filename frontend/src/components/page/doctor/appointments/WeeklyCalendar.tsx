"use client";

import React, { useMemo } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppointmentCard from "./AppointmentCard";
import { useTranslations } from "next-intl";
import { Appointment } from "@/types/appointment";

interface WeeklyCalendarProps {
  selectedDate: dayjs.Dayjs;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onQuickAction?: (id: string, action: "confirm" | "reject") => void;
}

export default function WeeklyCalendar({
  selectedDate,
  appointments,
  onAppointmentClick,
  onQuickAction,
}: WeeklyCalendarProps) {
  const t = useTranslations("doctorAppointments");
  const hours = useMemo(() => {
    const result = [];
    for (let i = 8; i <= 18; i++) {
      result.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return result;
  }, []);

  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [selectedDate]);

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    weekDays.forEach((day) => {
      const key = day.format("YYYY-MM-DD");
      map[key] = appointments?.filter(
        (apt: Appointment) => dayjs(apt.date).format("YYYY-MM-DD") === key
      );
    });
    return map;
  }, [appointments, weekDays]);

  const isToday = (day: dayjs.Dayjs) => day.isSame(dayjs(), "day");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header: Days of Week */}
        <div className="grid grid-cols-8 border-b-2 border-gray-200">
          <div className="p-3 bg-gray-50 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-600">Giờ</span>
            <span className="text-sm font-medium text-gray-600">
              {t("timeLabel")}
            </span>
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`
                p-3 text-center border-r border-gray-200
                ${isToday(day) ? "bg-blue-50" : "bg-gray-50"}
              `}
            >
              <div className="text-xs text-gray-500 uppercase">
                {day.format("ddd")}
              </div>
              <div
                className={`
                  text-lg font-semibold mt-1
                  ${isToday(day) ? "text-blue-600" : "text-gray-800"}
                `}
              >
                {day.format("DD")}
              </div>
              <div className="text-xs text-gray-500">{day.format("MMM")}</div>
              {appointmentsByDay[day.format("YYYY-MM-DD")]?.length > 0 && (
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {appointmentsByDay[day.format("YYYY-MM-DD")].length}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative">
          {hours.map((hour, hourIndex) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-100"
            >
              {/* Hour Label */}
              <div className="p-2 bg-gray-50 border-r border-gray-200 text-center">
                <span className="text-sm font-medium text-gray-600">
                  {hour}
                </span>
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIndex) => {
                const dayKey = day.format("YYYY-MM-DD");
                const dayAppointments = appointmentsByDay[dayKey] || [];

                return (
                  <div
                    key={dayIndex}
                    className={`
                      min-h-[80px] p-2 border-r border-gray-100
                      ${isToday(day) ? "bg-blue-50/30" : "bg-white"}
                      hover:bg-gray-50 transition-colors
                    `}
                  >
                    {hourIndex === 0 && dayAppointments.length > 0 && (
                      <div className="space-y-2">
                        {dayAppointments.map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            onClick={() => onAppointmentClick(apt)}
                            onQuickAction={onQuickAction}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Empty State for Week */}
        {Object.values(appointmentsByDay).every(
          (list) => list.length === 0
        ) && (
          <div className="py-16 text-center bg-gray-50">
            <CalendarOutlined className="text-6xl text-gray-300 mb-4" />
            <div className="text-lg font-medium text-gray-500 mb-2">
              {t("noAppointments")}
            </div>
            <div className="text-sm text-gray-400">{t("emptyWeek")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
