"use client";

import React, { useState } from "react";
import { Tag, Avatar, Button, Tooltip, Card } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { Appointment } from "@/types/appointment";
import { formatCurrency, Currency } from "@/utils/currency";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
  onQuickAction?: (id: string, action: "confirm" | "reject") => void;
}

export default function AppointmentCard({
  appointment,
  onClick,
  onQuickAction,
}: AppointmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tStatus = useTranslations("patientDashboard.status");

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: string; bg: string; label: string; borderColor: string }
    > = {
      pending: {
        color: "orange",
        bg: "bg-orange-50",
        label: tStatus("pending"),
        borderColor: "border-l-orange-500",
      },
      confirmed: {
        color: "green",
        bg: "bg-green-50",
        label: tStatus("confirmed"),
        borderColor: "border-l-green-500",
      },
      completed: {
        color: "blue",
        bg: "bg-blue-50",
        label: tStatus("completed"),
        borderColor: "border-l-blue-500",
      },
      cancelled: {
        color: "red",
        bg: "bg-red-50",
        label: tStatus("cancelled"),
        borderColor: "border-l-red-500",
      },
      rejected: {
        color: "red",
        bg: "bg-red-50",
        label: tStatus("rejected"),
        borderColor: "border-l-red-500",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(appointment.status);
  const patientInitials =
    appointment.patientInfo?.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const handleQuickAction = (
    e: React.MouseEvent,
    action: "confirm" | "reject"
  ) => {
    e.stopPropagation();
    onQuickAction?.(appointment?.id, action);
  };

  const locale =
    useLocale?.() ||
    (typeof navigator !== "undefined" ? navigator.language : "vi");
  const t = useTranslations("patientDashboard");
  const tActions = useTranslations("patientDashboard.actions");
  const currency: Currency = locale?.toString().startsWith("vi")
    ? "VND"
    : "USD";

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300
        ${isHovered ? "transform scale-102 shadow-lg" : "shadow-md"}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`border-l-4 ${statusConfig.borderColor} ${statusConfig.bg} rounded-lg hover:shadow-xl transition-shadow`}
        style={{ borderColor: "#1890ff" }}
        bodyStyle={{ padding: 16 }}
      >
        {/* Header: Time + Status */}
        <div className="flex items-center justify-between mb-3 border-red-500">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-blue-500" />
            <span className="font-semibold text-gray-800">
              {appointment.timeSlot.start} - {appointment.timeSlot.end}
            </span>
          </div>
          <Tag color={statusConfig.color} className="mb-0">
            {statusConfig.label}
          </Tag>
        </div>

        {/* Quick Actions (Show on hover for pending) */}
        {isHovered && appointment.status === "pending" && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <Tooltip title={tActions("confirm")}>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={(e) => handleQuickAction(e, "confirm")}
                className="bg-green-500 hover:bg-green-600 border-0"
              />
            </Tooltip>
            <Tooltip title={tActions("reject")}>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => handleQuickAction(e, "reject")}
              />
            </Tooltip>
          </div>
        )}

        {/* Patient Info */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            size={40}
            className="bg-blue-500 flex-shrink-0"
            icon={<UserOutlined />}
          >
            {patientInitials}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {appointment.patientInfo?.fullName || t("notAvailable")}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <PhoneOutlined className="text-xs" />
              <span className="truncate">
                {appointment.patientInfo?.phone || t("notAvailable")}
              </span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-2 mb-2">
          <FileTextOutlined className="text-gray-400 mt-1 flex-shrink-0" />
          <Tooltip title={appointment.reason}>
            <div className="text-sm text-gray-700 line-clamp-2">
              {appointment.reason || t("noReason")}
            </div>
          </Tooltip>
        </div>

        {/* Fee */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <DollarOutlined className="text-green-600" />
          <span className="font-bold text-green-600">
            {formatCurrency(appointment.fee || 0, { currency })}
          </span>
        </div>
      </Card>
    </div>
  );
}
