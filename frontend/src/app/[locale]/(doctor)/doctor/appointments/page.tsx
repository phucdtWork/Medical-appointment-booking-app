"use client";

import React, { useMemo, useState } from "react";
import { Card, Calendar, Col, Row, Empty, List, Tag } from "antd";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import { useDoctorAppointments } from "@/hooks/queries/useAppointmentsQuery";
import DoctorAppointmentDrawer from "@/components/page/doctor/appointments/DoctorAppointmentDrawer";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/utils/currency";
import { Appointment } from "@/types/appointment";
import { useUpdateAppointmentStatus } from "@/hooks/mutations/useAppointmentMutation";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

export default function DoctorAppointmentsPage() {
  const t = useTranslations("doctorAppointments");
  const locale = useLocale();
  const { data: apiData } = useDoctorAppointments();

  const appointments = useMemo(
    () => (Array.isArray(apiData?.data) ? apiData.data : []),
    [apiData]
  );

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentsForDay, setAppointmentsForDay] = useState<
    Appointment[] | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groupedByDay = useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");

    const days: Record<string, Appointment[]> = {};
    for (let i = 0; i < 7; i++) {
      const d = startOfWeek.add(i, "day");
      days[d.format("YYYY-MM-DD")] = [];
    }

    appointments.forEach((a: Appointment) => {
      const key = dayjs(a.date).format("YYYY-MM-DD");
      if (days[key]) days[key].push(a);
    });

    return days;
  }, [appointments, selectedDate]);

  const onSelectDate = (value: dayjs.Dayjs) => setSelectedDate(value);

  const { mutateAsync: updateStatus } = useUpdateAppointmentStatus();

  const handleOpen = (appt: Appointment, dayKey?: string) => {
    setSelectedAppointment(appt);
    setAppointmentsForDay(dayKey ? (groupedByDay[dayKey] ?? [appt]) : [appt]);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, data: { status } });
      setDrawerOpen(false);
    } catch (err) {
      // ignore here; mutation shows notification
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>

        <Row gutter={16}>
          <Col xs={24} lg={8}>
            <Card>
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onSelect={onSelectDate}
              />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(groupedByDay).map((dayKey) => {
                  const dayList = groupedByDay[dayKey];
                  return (
                    <div
                      key={dayKey}
                      className="p-2 border rounded border-[#1890ff] hover:shadow-lg hover:-translate-y-1 transition-transform transform duration-150"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {dayjs(dayKey).format("ddd, DD MMM")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("count", { count: dayList.length })}
                        </div>
                      </div>

                      {dayList.length === 0 ? (
                        <Empty description={false} />
                      ) : (
                        <List
                          dataSource={dayList}
                          renderItem={(item: Appointment) => (
                            <List.Item
                              onClick={() => handleOpen(item, dayKey)}
                              className="cursor-pointer p-3 rounded "
                            >
                              <List.Item.Meta
                                title={
                                  <div className="flex items-center gap-3">
                                    <Tag
                                      color={
                                        item.status === "pending"
                                          ? "orange"
                                          : item.status === "confirmed"
                                            ? "green"
                                            : "blue"
                                      }
                                    >
                                      {item.timeSlot.start}
                                    </Tag>
                                    <span className="font-semibold">
                                      {item.patientInfo?.fullName || "-"}
                                    </span>
                                  </div>
                                }
                                description={
                                  <div className="text-sm text-gray-500">
                                    {item.reason}
                                  </div>
                                }
                              />
                              <div className="text-sm text-gray-400">
                                {formatCurrency(item.fee || 0, {
                                  currency: locale?.toString().startsWith("vi")
                                    ? "VND"
                                    : "USD",
                                })}
                              </div>
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>
        </Row>

        <DoctorAppointmentDrawer
          open={drawerOpen}
          appointment={selectedAppointment}
          appointmentsForDay={appointmentsForDay}
          onClose={() => setDrawerOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
