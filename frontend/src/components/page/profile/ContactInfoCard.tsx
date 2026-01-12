"use client";

import React from "react";
import { Card, Form, Input } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = { form: any; isEditing: boolean };

export default function ContactInfoCard({ form, isEditing }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900"
    : "bg-gradient-to-br from-white via-green-50/30 to-blue-50/20";

  const cardBorder = isDark
    ? "border-2 border-gray-700/50"
    : "border-2 border-green-100/50";

  return (
    <Card
      className={`
        ${cardBg}
        ${cardBorder}
        shadow-xl rounded-3xl mb-8 overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-1
      `}
    >
      {/* Card Header with Icon - GREEN THEME */}
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-green-500 to-blue-500">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-green-500 to-blue-500 rounded-2xl blur opacity-50"></div>
          <div className="relative p-4 bg-linear-to-br from-green-500 to-blue-500 rounded-2xl shadow-lg">
            <PhoneOutlined className="text-3xl text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            {t("contactInfo")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("contactInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" size="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email - READ ONLY with visual indicator */}
          <Form.Item
            name="email"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <MailOutlined className="text-blue-500 text-lg" />
                {t("email")}
                <LockOutlined className="text-gray-400 text-xs" />
              </span>
            }
          >
            <Input
              disabled
              className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 cursor-not-allowed border-2 border-gray-200 dark:border-gray-700"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder={t("emailPlaceholder")}
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <PhoneOutlined className="text-green-500 text-lg" />
                {t("phone")}
              </span>
            }
            rules={[
              { required: true, message: t("required") },
              {
                pattern: /^[0-9]{10,11}$/,
                message: t("invalidPhone"),
              },
            ]}
          >
            <Input
              disabled={!isEditing}
              className={`h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-green-300 focus:border-green-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              prefix={<PhoneOutlined className="text-green-500" />}
              placeholder={t("phonePlaceholder")}
            />
          </Form.Item>

          {/* Address - FULL WIDTH */}
          <Form.Item
            name="address"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <HomeOutlined className="text-purple-500 text-lg" />
                {t("address")}
              </span>
            }
            className="lg:col-span-2"
          >
            <Input.TextArea
              disabled={!isEditing}
              rows={3}
              className={`rounded-xl ${
                isEditing
                  ? "border-2 border-purple-300 focus:border-purple-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              placeholder={t("addressPlaceholder")}
            />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
