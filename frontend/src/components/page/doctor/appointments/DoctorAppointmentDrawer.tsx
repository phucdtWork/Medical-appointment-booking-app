"use client";

import React, { useState } from "react";
import {
  Drawer,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  Avatar,
  Card,
} from "antd";
import {
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Appointment } from "@/types/appointment";
import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/utils/currency";

dayjs.locale("vi");

interface Props {
  open: boolean;
  appointment: Appointment | null;
  appointmentsForDay?: Appointment[] | null;
  onClose: () => void;
  onUpdateStatus?: (
    id: string,
    status: string,
    extra?: unknown
  ) => Promise<void> | void;
}

export default function DoctorAppointmentDrawer({
  open,
  appointment,
  appointmentsForDay,
  onClose,
  onUpdateStatus,
}: Props) {
  const t = useTranslations("patientDashboard");
  const tStatus = useTranslations("patientDashboard.status");
  const locale = useLocale();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // if no single appointment passed and no list, nothing to show
  if (!appointment && (!appointmentsForDay || appointmentsForDay.length === 0))
    return null;

  const activeAppointment: Appointment =
    appointmentsForDay?.[selectedIndex] ?? appointment!;
  const appointmentDate = dayjs(activeAppointment.date);

  const patientInitials =
    activeAppointment.patientInfo?.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      pending: { color: "orange", label: tStatus("pending") },
      confirmed: { color: "green", label: tStatus("confirmed") },
      completed: { color: "blue", label: tStatus("completed") },
      cancelled: { color: "red", label: tStatus("cancelled") },
      rejected: { color: "red", label: tStatus("rejected") },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(activeAppointment.status);

  const appointmentId = activeAppointment.id ?? "";

  // Contextual buttons
  const canConfirm = activeAppointment.status === "pending";
  const canComplete = activeAppointment.status === "confirmed";
  // Only allow cancel when appointment is still pending. Once confirmed it cannot be cancelled here.
  const canCancel = activeAppointment.status === "pending";

  return (
    <Drawer
      title={
        <Space>
          <CalendarOutlined style={{ color: "#1890ff", fontSize: 20 }} />
          <span className="text-lg font-semibold">
            {t("appointmentDrawer.title")}
          </span>
        </Space>
      }
      placement="bottom"
      height="auto"
      onClose={onClose}
      open={open}
      closeIcon={<CloseOutlined />}
      className="appointment-drawer"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Tag
            color={statusConfig.color}
            className="text-base px-4 py-2 font-semibold"
          >
            {statusConfig.label}
          </Tag>
          <div className="text-sm text-gray-500">
            ID: {appointmentId ? appointmentId.slice(-8) : "N/A"}
          </div>
        </div>

        {/* Rich Patient Profile Card */}
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Avatar
              size={80}
              className=" bg-linear-to-r from-blue-500 to-indigo-600 shrink-0"
              style={{ fontSize: 32, fontWeight: "bold" }}
            >
              {patientInitials}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {activeAppointment.patientInfo?.fullName || t("notAvailable")}
                </h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarFilled key={star} style={{ color: "orange" }} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneOutlined className="text-blue-500" />
                  <span>
                    {activeAppointment.patientInfo?.phone || t("notAvailable")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MailOutlined className="text-blue-500" />
                  <span className="truncate">
                    {activeAppointment.patientInfo?.email || t("notAvailable")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <EnvironmentOutlined className="text-blue-500" />
                  <span>
                    {activeAppointment.patientInfo?.address ||
                      t("patientInfo.location")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <HistoryOutlined className="text-blue-500" />
                  <span>{t("patientInfo.previousVisits", { count: 3 })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Divider />

        {/* Appointment Details */}
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <span className="font-medium">
                  {t("appointmentDrawer.date")}
                </span>
              </Space>
            }
          >
            <span className="font-semibold text-lg">
              {appointmentDate.format("dddd, DD MMMM YYYY")}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <span className="font-medium">
                  {t("appointmentDrawer.time")}
                </span>
              </Space>
            }
          >
            <span className="font-semibold text-lg">
              {activeAppointment.timeSlot.start} -{" "}
              {activeAppointment.timeSlot.end}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <span className="font-medium">
                  {t("appointmentDrawer.reason")}
                </span>
              </Space>
            }
          >
            <div className="text-gray-700">
              {activeAppointment.reason || t("none")}
            </div>
          </Descriptions.Item>

          {activeAppointment.notes && (
            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined style={{ color: "#1890ff" }} />
                  <span className="font-medium">
                    {t("appointmentDrawer.notes")}
                  </span>
                </Space>
              }
            >
              <div className="text-gray-700">{activeAppointment.notes}</div>
            </Descriptions.Item>
          )}

          <Descriptions.Item
            label={
              <Space>
                <DollarOutlined style={{ color: "#1890ff" }} />
                <span className="font-medium">
                  {t("appointmentDrawer.fee")}
                </span>
              </Space>
            }
          >
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(activeAppointment.fee || 0, {
                currency: locale?.toString().startsWith("vi") ? "VND" : "USD",
              })}
            </span>
          </Descriptions.Item>
        </Descriptions>

        {/* If multiple appointments for the day, show a small selector list */}
        {appointmentsForDay && appointmentsForDay.length > 1 && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">
              <p className="text-xs text-blue-400 mb-2">
                (*) {t("selectSlotNote")}
              </p>
              {t("count", { count: appointmentsForDay.length })}
            </div>
            <div className="flex gap-2 overflow-auto">
              {appointmentsForDay.map((apt, idx) => (
                <Button
                  key={apt.id}
                  type={idx === selectedIndex ? "primary" : "default"}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {apt.timeSlot.start}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Contextual Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {canConfirm && (
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={async () => {
                try {
                  if (!appointmentId) return;
                  setLoadingAction("confirm");
                  await onUpdateStatus?.(appointmentId, "confirmed");
                } finally {
                  setLoadingAction(null);
                }
              }}
              loading={loadingAction === "confirm"}
              className="flex-1 bg-green-500 hover:bg-green-600 border-0 h-12 font-semibold"
            >
              {t("actions.confirm")}
            </Button>
          )}

          {canComplete && (
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={async () => {
                try {
                  if (!appointmentId) return;
                  setLoadingAction("complete");
                  await onUpdateStatus?.(appointmentId, "completed");
                } finally {
                  setLoadingAction(null);
                }
              }}
              loading={loadingAction === "complete"}
              className="flex-1 h-12 font-semibold"
            >
              {t("actions.complete")}
            </Button>
          )}

          {canCancel && (
            <Button
              danger
              size="large"
              icon={<CloseCircleOutlined />}
              onClick={async () => {
                try {
                  if (!appointmentId) return;
                  setLoadingAction("cancel");
                  await onUpdateStatus?.(appointmentId, "cancelled");
                } finally {
                  setLoadingAction(null);
                }
              }}
              loading={loadingAction === "cancel"}
              className="flex-1 h-12 font-semibold"
            >
              {t("actions.cancel")}
            </Button>
          )}

          {appointment.status === "completed" && (
            <div className="flex-1 text-center py-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 font-medium">
                ✓ {tStatus("completed")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
