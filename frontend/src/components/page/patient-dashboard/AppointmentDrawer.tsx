"use client";

import React from "react";
import { Drawer, Button, Space, Tag, Descriptions, Divider } from "antd";
import {
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
  notes?: string;
  fee: number;
  doctorInfo?: {
    fullName: string;
    specialization: string;
    hospital?: string;
    avatar?: string;
  };
}

interface AppointmentDrawerProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  onViewDoctor?: (doctorId: string) => void;
  isDark?: boolean;
}

const STATUS_CONFIG = {
  pending: {
    color: "orange",
  },
  confirmed: {
    color: "green",
  },
  completed: {
    color: "blue",
  },
  cancelled: {
    color: "red",
  },
  rejected: {
    color: "red",
  },
};

export default function AppointmentDrawer({
  open,
  appointment,
  onClose,
  onReschedule,
  onCancel,
  onViewDoctor,
  isDark = false,
}: AppointmentDrawerProps) {
  const t = useTranslations("patientDashboard.appointmentDrawer");
  const tStatus = useTranslations("patientDashboard.status");

  if (!appointment) return null;

  const statusConfig = STATUS_CONFIG[appointment.status];
  const appointmentDate = dayjs(appointment.date);
  const canModify =
    appointment.status === "pending" || appointment.status === "confirmed";

  return (
    <Drawer
      title={
        <Space>
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <span>{t("title")}</span>
        </Space>
      }
      placement="bottom"
      height="auto"
      onClose={onClose}
      open={open}
      closeIcon={<CloseOutlined />}
      extra={
        canModify && (
          <Space>
            {appointment.status !== "cancelled" && (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onReschedule?.(appointment.id)}
                >
                  {t("reschedule")}
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onCancel?.(appointment.id)}
                >
                  {t("cancel")}
                </Button>
              </>
            )}
          </Space>
        )
      }
      className={isDark ? "dark-drawer" : ""}
      styles={{
        header: {
          borderBottom: "2px solid #1890ff",
        },
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Tag
            color={statusConfig.color}
            style={{
              fontSize: "16px",
              padding: "8px 16px",
              fontWeight: 600,
            }}
          >
            {tStatus(
              appointment.status as
                | "pending"
                | "confirmed"
                | "completed"
                | "cancelled"
                | "rejected"
            )}
          </Tag>

          <div
            className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}
          >
            ID: {appointment.id.slice(-8)}
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Main Info */}
        <Descriptions
          column={1}
          bordered
          size="middle"
          styles={{
            label: {
              fontWeight: 600,
              width: "140px",
              backgroundColor: isDark ? "#1e293b" : "#fafafa",
            },
            content: {
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
            },
          }}
        >
          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                {t("date")}
              </Space>
            }
          >
            <span className="font-semibold">
              {appointmentDate.format("dddd, DD MMMM YYYY")}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                {t("time")}
              </Space>
            }
          >
            <span className="font-semibold">
              {appointment.timeSlot.start} - {appointment.timeSlot.end}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                Bác sĩ
              </Space>
            }
          >
            <div>
              <div className="font-semibold mb-1">
                {appointment.doctorInfo?.fullName || "Đang cập nhật"}
              </div>
              {appointment.doctorInfo?.specialization && (
                <Tag color="blue">{appointment.doctorInfo.specialization}</Tag>
              )}
            </div>
          </Descriptions.Item>

          {appointment.doctorInfo?.hospital && (
            <Descriptions.Item
              label={
                <Space>
                  <MedicineBoxOutlined style={{ color: "#1890ff" }} />
                  {t("hospital")}
                </Space>
              }
            >
              {appointment.doctorInfo.hospital}
            </Descriptions.Item>
          )}

          <Descriptions.Item
            label={
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                {t("reason")}
              </Space>
            }
          >
            {appointment.reason}
          </Descriptions.Item>

          {appointment.notes && (
            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined style={{ color: "#1890ff" }} />
                  {t("notes")}
                </Space>
              }
            >
              {appointment.notes}
            </Descriptions.Item>
          )}

          <Descriptions.Item
            label={
              <Space>
                <DollarOutlined style={{ color: "#1890ff" }} />
                {t("fee")}
              </Space>
            }
          >
            <span className="text-lg font-bold text-blue-600">
              {appointment.fee.toLocaleString()}đ
            </span>
          </Descriptions.Item>
        </Descriptions>

        {/* Actions */}
        {appointment.doctorInfo && (
          <div className="mt-6">
            <Button
              block
              size="large"
              onClick={() => onViewDoctor?.(appointment.doctorId)}
              style={{
                borderColor: "#1890ff",
                color: "#1890ff",
              }}
            >
              <UserOutlined /> {t("viewDoctor")}
            </Button>
          </div>
        )}

        {/* Note */}
        <div
          className={`p-4 rounded-lg text-sm ${
            isDark ? "bg-slate-900 text-slate-400" : "bg-gray-50 text-gray-600"
          }`}
        >
          {t("reminder")}
        </div>
      </div>
    </Drawer>
  );
}
