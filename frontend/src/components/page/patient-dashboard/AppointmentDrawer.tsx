"use client";

import React, { useState } from "react";
import ReviewModal from "@/components/ui/ReviewModal";
import {
  App,
  Drawer,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  Tooltip,
  Modal,
  DatePicker,
  Select,
  message,
} from "antd";
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
import dayjs, { Dayjs } from "dayjs";
import scheduleService, { TimeSlot } from "@/lib/services/scheduleService";
import "dayjs/locale/vi";
import { useTranslations } from "next-intl";
import {
  useCancelAppointment,
  useRescheduleAppointment,
} from "@/hooks/mutations/useAppointmentMutation";

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
  isDark = false,
}: AppointmentDrawerProps) {
  const t = useTranslations("patientDashboard.appointmentDrawer");
  const tStatus = useTranslations("patientDashboard.status");
  const [showReview, setShowReview] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();
  const { modal } = App.useApp();

  if (!appointment) return null;

  const statusConfig = STATUS_CONFIG[appointment.status];
  const appointmentDate = dayjs(appointment.date);
  const canModify =
    appointment.status === "pending" || appointment.status === "confirmed";

  // Allow reschedule only when appointment is still pending and more than 24 hours away
  const hoursUntil = appointmentDate.diff(dayjs(), "hour");
  const canReschedule = appointment.status === "pending" && hoursUntil > 24;

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
                <Tooltip
                  title={
                    !canReschedule ? t("rescheduleDisabledTooltip") : undefined
                  }
                >
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      // open internal reschedule modal
                      const d = dayjs(appointment.date);
                      setSelectedDate(d);
                      setSelectedDateStr(d.format("YYYY-MM-DD"));
                      setSelectedSlot(
                        `${appointment.timeSlot.start}-${appointment.timeSlot.end}`
                      );
                      // preload slots for the selected date
                      (async () => {
                        setSlotsLoading(true);
                        try {
                          const slots = await scheduleService.getAvailableSlots(
                            appointment.doctorId,
                            d.format("YYYY-MM-DD")
                          );
                          setAvailableSlots(slots || []);
                        } catch (err) {
                          setAvailableSlots([]);
                        } finally {
                          setSlotsLoading(false);
                        }
                      })();
                      setRescheduleVisible(true);
                    }}
                    disabled={!canReschedule}
                  >
                    {t("reschedule")}
                  </Button>
                </Tooltip>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: t("cancelConfirmTitle") || "Xác nhận hủy",
                      content:
                        t("cancelConfirmMessage") ||
                        "Bạn có chắc chắn muốn hủy lịch này?",
                      onOk: async () => {
                        try {
                          await cancelMutation.mutateAsync(appointment.id);
                          onCancel?.(appointment.id);
                          onClose();
                        } catch (e) {
                          // errors handled by mutation
                          message.error("Failed to cancel appointment: " + e);
                        }
                      },
                    });
                  }}
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

        {/* Note */}
        <div
          className={`p-4 rounded-lg text-sm ${
            isDark ? "bg-slate-900 text-slate-400" : "bg-gray-50 text-gray-600"
          }`}
        >
          {t("reminder")}
        </div>
        {/* Review action for completed appointments */}
        {appointment.status === "completed" && (
          <div className="mt-4">
            <Button
              block
              type="primary"
              onClick={() => setShowReview(true)}
              style={{ background: "#1890ff", borderColor: "#1890ff" }}
            >
              {t("leaveReviewButton")}
            </Button>
          </div>
        )}
        <ReviewModal
          open={showReview}
          doctorId={appointment.doctorId}
          appointmentId={appointment.id}
          onClose={() => setShowReview(false)}
        />
        <Modal
          title={t("rescheduleTitle") || "Dời lịch hẹn"}
          open={rescheduleVisible}
          onCancel={() => setRescheduleVisible(false)}
          okText={t("reschedule")}
          confirmLoading={(rescheduleMutation as any).isLoading}
          onOk={async () => {
            if (!selectedDate || !selectedSlot) return;
            try {
              const [start, end] = selectedSlot.split("-");
              const payload = {
                date: selectedDate.startOf("day").toISOString(),
                timeSlot: { start, end },
              };
              await rescheduleMutation.mutateAsync({
                id: appointment.id,
                data: payload,
              });
              setRescheduleVisible(false);
              onReschedule?.(appointment.id);
              onClose();
            } catch (e) {
              // mutation displays error notifications
            }
          }}
        >
          <div className="space-y-4">
            <DatePicker
              value={selectedDate}
              onChange={(d) => {
                setSelectedDate(d);
                if (!d) {
                  setSelectedDateStr(null);
                  setAvailableSlots([]);
                  setSelectedSlot(null);
                  return;
                }
                const str = d.format("YYYY-MM-DD");
                setSelectedDateStr(str);
                (async () => {
                  setSlotsLoading(true);
                  try {
                    const slots = await scheduleService.getAvailableSlots(
                      appointment.doctorId,
                      str
                    );
                    setAvailableSlots(slots || []);
                  } catch (err) {
                    setAvailableSlots([]);
                    message.error("Failed to load available slots: " + err);
                  } finally {
                    setSlotsLoading(false);
                  }
                })();
              }}
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
              style={{ width: "100%" }}
            />

            <Select
              placeholder={t("selectTime")}
              value={selectedSlot ?? undefined}
              onChange={(val) => setSelectedSlot(val)}
              style={{ width: "100%" }}
              loading={slotsLoading}
              disabled={!selectedDateStr || slotsLoading}
            >
              {!slotsLoading && availableSlots.length === 0 && (
                <Select.Option value="" disabled>
                  {t("noSlots")}
                </Select.Option>
              )}
              {availableSlots
                .filter((s) => s.isAvailable)
                .map((s) => {
                  const val = `${s.start}-${s.end}`;
                  return (
                    <Select.Option key={val} value={val}>
                      {val}
                    </Select.Option>
                  );
                })}
            </Select>
          </div>
        </Modal>
      </div>
    </Drawer>
  );
}
