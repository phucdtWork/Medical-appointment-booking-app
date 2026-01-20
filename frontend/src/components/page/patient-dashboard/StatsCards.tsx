"use client";

import React from "react";
import { Card, Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface Appointment {
  id: string;
  date: string | Date | null;
  status: string;
  timeSlot: {
    start: string;
    end: string;
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: string;
  isDark?: boolean;
  onClick?: () => void;
}

interface StatsCardsProps {
  appointments: Appointment[];
  onCardClick?: (type: "upcoming" | "today" | "pending") => void;
  isDark?: boolean;
}

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
  isDark = false,
  onClick,
}: StatCardProps) => (
  <Card
    hoverable={!!onClick}
    onClick={onClick}
    className={`transition-all ${
      isDark
        ? "bg-slate-800 border-slate-700 hover:border-blue-600"
        : "bg-white border-gray-200 hover:border-blue-400"
    }`}
    styles={{
      body: { padding: "20px" },
    }}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-lg flex items-center justify-center`}
        style={{
          backgroundColor: `${color}15`,
        }}
      >
        <span style={{ color, fontSize: 24 }}>{icon}</span>
      </div>

      <div className="flex-1">
        <div
          className={`text-sm mb-1 ${
            isDark ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {title}
        </div>
        <div className="text-3xl font-bold mb-1" style={{ color }}>
          {value}
        </div>
        <div
          className={`text-xs ${isDark ? "text-slate-500" : "text-gray-500"}`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  </Card>
);

export default function StatsCards({
  appointments,
  onCardClick,
  isDark = false,
}: StatsCardsProps) {
  const t = useTranslations("patientDashboard.stats");
  
  // Filter out appointments with null dates
  const validAppointments = appointments.filter((apt) => apt.date !== null);
  
  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  const upcomingCount = validAppointments.filter((apt) => {
    const aptDate = new Date(apt.date!);
    return aptDate >= today && aptDate <= nextWeek;
  }).length;

  const todayAppointments = validAppointments.filter((apt) => {
    const aptDate = new Date(apt.date!);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  const todayCount = todayAppointments.length;
  const todayTimes = todayAppointments
    .map((apt) => apt.timeSlot.start)
    .slice(0, 2)
    .join(", ");

  const pendingCount = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;

  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={24} md={8}>
        <StatCard
          icon={<CalendarOutlined />}
          title={t("upcoming")}
          value={upcomingCount}
          subtitle={t("upcomingSubtitle")}
          color="#1890ff"
          isDark={isDark}
          onClick={() => onCardClick?.("upcoming")}
        />
      </Col>

      <Col xs={24} sm={24} md={8}>
        <StatCard
          icon={<ClockCircleOutlined />}
          title={t("today")}
          value={todayCount}
          subtitle={todayTimes || t("noSchedule")}
          color="#52c41a"
          isDark={isDark}
          onClick={() => onCardClick?.("today")}
        />
      </Col>

      <Col xs={24} sm={24} md={8}>
        <StatCard
          icon={<ExclamationCircleOutlined />}
          title={t("pending")}
          value={pendingCount}
          subtitle={t("pendingSubtitle")}
          color="#faad14"
          isDark={isDark}
          onClick={() => onCardClick?.("pending")}
        />
      </Col>
    </Row>
  );
}
