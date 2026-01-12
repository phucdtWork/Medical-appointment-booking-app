"use client";

import React from "react";
import { Card } from "antd";
import {
  CalendarOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Appointment } from "@/types/appointment";
import { useTranslations } from "next-intl";

interface StatsCardsProps {
  appointments: Appointment[];
  selectedDate: dayjs.Dayjs;
}

export default function StatsCards({
  appointments,
  selectedDate,
}: StatsCardsProps) {
  const t = useTranslations("doctorAppointments");
  const tStatus = useTranslations("patientDashboard.status");
  // Today's appointments
  const todayAppointments = appointments?.filter((apt) =>
    dayjs(apt.date).isSame(dayjs(), "day")
  );

  // This week's appointments
  const startOfWeek = selectedDate.startOf("week");
  const endOfWeek = selectedDate.endOf("week");
  const weekAppointments = appointments.filter((apt) => {
    const date = dayjs(apt.date);
    return date.isAfter(startOfWeek) && date.isBefore(endOfWeek);
  });

  // Pending appointments
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );

  // Completed appointments
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );

  const stats = [
    {
      title: t("today"),
      value: todayAppointments.length,
      icon: <CalendarOutlined />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: t("weekCurrent"),
      value: weekAppointments.length,
      icon: <BarChartOutlined />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: tStatus("pending"),
      value: pendingAppointments.length,
      icon: <ClockCircleOutlined />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: tStatus("completed"),
      value: completedAppointments.length,
      icon: <CheckCircleOutlined />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`
            ${stat.bgColor} border ${stat.borderColor}
            hover:shadow-lg transition-all duration-300
            hover:scale-105
          `}
          variant="plain"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">{stat.title}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div
              className={`
                text-4xl ${stat.color} opacity-50
              `}
            >
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
