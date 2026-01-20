"use client";

import React, { useMemo, useState } from "react";
import { Card, Button, Space, message } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import { useDoctorAppointments } from "@/hooks/queries/useAppointmentsQuery";
import { useUpdateAppointmentStatus } from "@/hooks/mutations/useAppointmentMutation";
import WeeklyCalendar from "@/components/page/doctor/appointments/WeeklyCalendar";
import StatsCards from "@/components/page/doctor/appointments/StatsCards";
import DoctorAppointmentDrawer from "@/components/page/doctor/appointments/DoctorAppointmentDrawer";
import { Appointment } from "@/types/appointment";
import { useTranslations } from "next-intl";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

export default function DoctorAppointmentsPage() {
  const t = useTranslations("doctorAppointments");
  const tNotify = useTranslations("patientDashboard.notifications");
  const { data: apiData } = useDoctorAppointments();

  const appointments = useMemo(
    () => (Array.isArray(apiData?.data) ? apiData.data : []),
    [apiData]
  );

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aIsToday = dayjs(a.date).isSame(dayjs(), "day");
      const bIsToday = dayjs(b.date).isSame(dayjs(), "day");

      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      const aDate = dayjs(a.date);
      const bDate = dayjs(b.date);
      if (!aDate.isSame(bDate, "day")) return aDate.isBefore(bDate) ? -1 : 1;

      const aStart = a.timeSlot?.start || "00:00";
      const bStart = b.timeSlot?.start || "00:00";
      return aStart.localeCompare(bStart);
    });
  }, [appointments]);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mutateAsync: updateStatus } = useUpdateAppointmentStatus();

  const handlePreviousWeek = () => {
    setSelectedDate(selectedDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setSelectedDate(selectedDate.add(1, "week"));
  };

  const handleToday = () => {
    setSelectedDate(dayjs());
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleQuickAction = async (
    id: string,
    action: "confirm" | "reject"
  ) => {
    try {
      const status = action === "confirm" ? "confirmed" : "rejected";
      await updateStatus({ id, data: { status } });
      message.success(
        action === "confirm" ? tNotify("confirmed") : tNotify("rejected")
      );
    } catch {
      message.error(tNotify("error"));
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, data: { status } });

      const messages: Record<string, string> = {
        confirmed: tNotify("confirmed"),
        completed: tNotify("completed"),
        cancelled: tNotify("cancelled"),
      };

      message.success(messages[status] || tNotify("updated"));
      setDrawerOpen(false);
    } catch {
      message.error(tNotify("error"));
    }
  };

  const weekStart = selectedDate.startOf("week");
  const weekEnd = selectedDate.endOf("week");

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📅 {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <StatsCards
          appointments={sortedAppointments}
          selectedDate={selectedDate}
        />

        {/* Week Navigation */}
        <Card className="mb-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarOutlined className="text-2xl text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">{t("weekCurrent")}</div>
                <div className="text-lg font-semibold text-gray-800">
                  {weekStart.format("DD MMM")} - {weekEnd.format("DD MMM YYYY")}
                </div>
              </div>
            </div>

            <Space size="middle">
              <Button
                icon={<LeftOutlined />}
                onClick={handlePreviousWeek}
                className="h-10"
              >
                {t("prevWeek")}
              </Button>
              <Button onClick={handleToday} type="primary" className="h-10">
                {t("today")}
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={handleNextWeek}
                iconPosition="end"
                className="h-10"
              >
                {t("nextWeek")}
              </Button>
            </Space>
          </div>
        </Card>

        {/* Weekly Calendar */}
        <Card className="shadow-lg">
          <WeeklyCalendar
            selectedDate={selectedDate}
            appointments={sortedAppointments}
            onAppointmentClick={handleAppointmentClick}
            onQuickAction={handleQuickAction}
          />
        </Card>

        {/* Appointment Drawer */}
        <DoctorAppointmentDrawer
          open={drawerOpen}
          appointment={selectedAppointment}
          onClose={() => setDrawerOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
