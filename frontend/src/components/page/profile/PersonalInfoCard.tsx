"use client";

import React from "react";
import { Card, Form, Input, DatePicker, Select } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = {
  form: any;
  isEditing: boolean;
};

export default function PersonalInfoCard({ form, isEditing }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900"
    : "bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20";

  const cardBorder = isDark
    ? "border-2 border-gray-700/50"
    : "border-2 border-blue-100/50";

  return (
    <Card
      className={`
        ${cardBg}
        ${cardBorder}
        shadow-xl rounded-3xl mb-8 overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-1
      `}
      variant="plain"
    >
      {/* Card Header with Icon - MUCH MORE PROMINENT */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-50"></div>
          <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <UserOutlined className="text-3xl text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("personalInfo")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("personalInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" size="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Name */}
          <Form.Item
            name="fullName"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <UserOutlined className="text-blue-500 text-lg" />
                {t("fullName")}
              </span>
            }
            rules={[{ required: true, message: t("required") }]}
          >
            <Input
              disabled={!isEditing}
              className={`h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-blue-300 focus:border-blue-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              placeholder={t("fullNamePlaceholder")}
            />
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item
            name="dateOfBirth"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <CalendarOutlined className="text-blue-500 text-lg" />
                {t("dateOfBirth")}
              </span>
            }
          >
            <DatePicker
              disabled={!isEditing}
              className={`w-full h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-blue-300 focus:border-blue-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              placeholder={t("selectDatePlaceholder")}
            />
          </Form.Item>

          {/* Gender */}
          <Form.Item
            name="gender"
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <ManOutlined className="text-blue-500 text-lg" />
                {t("gender")}
              </span>
            }
          >
            <Select
              disabled={!isEditing}
              className={`h-12 ${
                isEditing ? "" : "bg-gray-50 dark:bg-gray-800"
              }`}
              placeholder={t("selectGenderPlaceholder")}
            >
              <Select.Option value="male">
                <span className="flex items-center gap-2">
                  <ManOutlined className="text-blue-500" />
                  {t("male")}
                </span>
              </Select.Option>
              <Select.Option value="female">
                <span className="flex items-center gap-2">
                  <WomanOutlined className="text-pink-500" />
                  {t("female")}
                </span>
              </Select.Option>
              <Select.Option value="other">
                <span className="flex items-center gap-2">
                  <UserOutlined className="text-purple-500" />
                  {t("other")}
                </span>
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
