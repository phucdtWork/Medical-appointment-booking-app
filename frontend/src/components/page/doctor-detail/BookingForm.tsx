"use client";

import { Card, Form, DatePicker, Select, Input, Button, Drawer } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCreateAppointment } from "@/hooks";
import dayjs from "dayjs";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import type { Doctor } from "@/types/doctor";
import { CreateAppointmentData } from "@/lib/services";
import { DEFAULT_RANGE_SLOTS } from "@/utils/timeSlots";

const { TextArea } = Input;

interface BookingFormProps {
  doctorId: string;
  doctor?: Doctor;
  isMobile?: boolean;
}

export default function BookingForm({
  doctorId,
  doctor,
  isMobile = false,
}: BookingFormProps) {
  const t = useTranslations("doctorDetail.booking");
  const { isDark } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const createAppointmentMutation = useCreateAppointment();
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const timeSlots = DEFAULT_RANGE_SLOTS;

  const onFinish = (values: CreateAppointmentData) => {
    const [start, end] = values.timeSlot.split("-");

    createAppointmentMutation.mutate(
      {
        doctorId,
        date: values.date,
        timeSlot: { start, end },
        reason: values.reason,
        notes: values.notes,
        fee: doctor?.doctorInfo?.consultationFee?.min,
      },
      {
        onSuccess: () => {
          form.resetFields();
          if (isMobile) {
            setDrawerVisible(false);
          }
          router.push(locale ? `/${locale}/appointments` : "/appointments");
        },
      }
    );
  };

  // Render form fields - OPTIMIZED VERSION
  const renderFormFields = () => (
    <>
      <Form.Item
        label={
          <span
            className={`font-semibold flex items-center gap-2 ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            <CalendarOutlined style={{ color: "var(--primary-color)" }} />
            {t("selectDate")}
          </span>
        }
        name="date"
        rules={[{ required: true, message: t("dateRequired") }]}
        className="mb-3"
      >
        <DatePicker
          style={{
            width: "100%",
            borderColor: "var(--primary-color)",
          }}
          format="DD/MM/YYYY"
          disabledDate={(current) => {
            return current && current < dayjs().startOf("day");
          }}
          placeholder={t("selectDatePlaceholder")}
          className={isDark ? "dark-datepicker" : ""}
        />
      </Form.Item>

      <Form.Item
        label={
          <span
            className={`font-semibold flex items-center gap-2 ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            <ClockCircleOutlined style={{ color: "var(--primary-color)" }} />
            {t("selectTime")}
          </span>
        }
        name="timeSlot"
        rules={[{ required: true, message: t("timeRequired") }]}
        className="mb-3"
      >
        <Select
          placeholder={t("selectTimePlaceholder")}
          className={isDark ? "dark-select" : ""}
          style={{ borderColor: "var(--primary-color)" }}
        >
          {timeSlots.map((slot) => (
            <Select.Option key={slot} value={slot}>
              {slot}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={
          <span
            className={`font-semibold flex items-center gap-2 ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            <FileTextOutlined style={{ color: "var(--primary-color)" }} />
            {t("reason")}
          </span>
        }
        name="reason"
        rules={[{ required: true, message: t("reasonRequired") }]}
        className="mb-3"
      >
        <TextArea
          rows={2}
          placeholder={t("reasonPlaceholder")}
          className={isDark ? "dark-textarea" : ""}
          style={{
            borderColor: "var(--primary-color)",
          }}
        />
      </Form.Item>

      <Form.Item
        label={
          <span
            className={`font-semibold flex items-center gap-2 ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            <FileTextOutlined style={{ color: "var(--primary-color)" }} />
            {t("notes")}
          </span>
        }
        name="notes"
        className="mb-4"
      >
        <TextArea
          rows={1}
          placeholder={t("notesPlaceholder")}
          className={isDark ? "dark-textarea" : ""}
          style={{
            borderColor: "var(--primary-color)",
          }}
        />
      </Form.Item>

      {/* Fee Box - Compact */}
      <div
        className={`p-3 rounded-lg mb-4 border-2 transition-all`}
        style={{
          borderColor: "var(--primary-color)",
          backgroundColor: isDark
            ? "rgba(24, 144, 255, 0.05)"
            : "rgba(24, 144, 255, 0.02)",
        }}
      >
        <div className="flex justify-between items-center">
          <span
            className={`flex items-center gap-2 font-semibold text-sm ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            <DollarOutlined style={{ color: "var(--primary-color)" }} />
            {t("fee")}:
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--primary-color)" }}
          >
            {doctor?.doctorInfo?.consultationFee?.min?.toLocaleString()}đ
          </span>
        </div>
      </div>

      <Form.Item className="mb-2">
        <Button
          type="primary"
          htmlType="submit"
          loading={createAppointmentMutation.isPending}
          block
          size="large"
          className="h-11 font-semibold"
          style={{
            backgroundColor: "var(--primary-color)",
            borderColor: "var(--primary-color)",
          }}
        >
          {t("submit")}
        </Button>
      </Form.Item>

      <p
        className={`text-xs text-center ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        {t("submitNote")}
      </p>
    </>
  );

  // Mobile: Bottom Bar + Drawer
  if (isMobile) {
    return (
      <>
        {/* Fixed Bottom Bar */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t-2 shadow-lg transition-all`}
          style={{
            borderColor: "var(--primary-color)",
            backgroundColor: isDark
              ? "var(--background-dark)"
              : "var(--background)",
          }}
        >
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-text-secondary-dark" : "text-text-secondary"
                }`}
              >
                {t("fee")}
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--primary-color)" }}
              >
                {doctor?.doctorInfo?.consultationFee?.min?.toLocaleString()}đ
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => setDrawerVisible(true)}
              className="h-12 px-8 font-semibold"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              {t("submit")}
            </Button>
          </div>
        </div>

        {/* Booking Drawer */}
        <Drawer
          title={
            <span
              className={`font-semibold flex items-center gap-2 ${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              <CalendarOutlined style={{ color: "var(--primary-color)" }} />
              {t("title")}
            </span>
          }
          placement="bottom"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          height="auto"
          className={isDark ? "dark-drawer" : ""}
          headerStyle={{
            borderColor: "var(--primary-color)",
            borderBottomWidth: "2px",
          }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            {renderFormFields()}
          </Form>
        </Drawer>
      </>
    );
  }

  // Desktop: Sticky Card with max-height
  return (
    <div className="sticky top-6" style={{ maxHeight: "calc(100vh - 120px)" }}>
      <Card
        className={`shadow-md border-2 overflow-auto`}
        style={{
          borderColor: "var(--primary-color)",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        <h2
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDark ? "text-text-primary-dark" : "text-text-primary"
          }`}
        >
          <CalendarOutlined style={{ color: "var(--primary-color)" }} />
          {t("title")}
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish} size="middle">
          {renderFormFields()}
        </Form>
      </Card>
    </div>
  );
}
