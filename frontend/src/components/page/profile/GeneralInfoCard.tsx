"use client";

import React from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Divider,
  FormInstance,
} from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = {
  form: FormInstance;
  isEditing: boolean;
  isLoading?: boolean;
};

export default function GeneralInfoCard({ form, isEditing, isLoading }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textPrimary = isDark ? "text-text-primary-dark" : "text-text-primary";
  const textSecondary = isDark
    ? "text-text-secondary-dark"
    : "text-text-secondary";

  return (
    <Card
      className={`
        ${cardBg}
        border ${borderColor}
        shadow-sm rounded-lg
        transition-all duration-300
        hover:shadow-md hover:border-primary
      `}
      loading={isLoading}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <IdcardOutlined className="text-xl text-primary" />
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${textPrimary}`}>
            {t("generalInfo")}
          </h3>
          <p className={`text-sm ${textSecondary}`}>
            {t("generalInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical">
        {/* Personal Information Section */}
        <div className="mb-4">
          <h4
            className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
          >
            <UserOutlined className="text-primary" />
            {t("personalInfo")}
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item
              name="fullName"
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("fullName")}
                </span>
              }
              rules={[{ required: true, message: t("required") }]}
            >
              <Input
                disabled={!isEditing}
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("fullNamePlaceholder")}
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("dateOfBirth")}
                </span>
              }
            >
              <DatePicker
                disabled={!isEditing}
                className="w-full h-10"
                placeholder={t("selectDatePlaceholder")}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("gender")}
                </span>
              }
              className="lg:col-span-2"
            >
              <Select
                disabled={!isEditing}
                placeholder={t("selectGenderPlaceholder")}
                className="h-10"
              >
                <Select.Option value="male">
                  <span className="flex items-center gap-2">
                    <ManOutlined className="text-primary" />
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
        </div>

        <Divider className={isDark ? "border-gray-700" : "border-gray-200"} />

        {/* Contact Information Section */}
        <div>
          <h4
            className={`text-sm font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
          >
            <PhoneOutlined className="text-primary" />
            {t("contactInfo")}
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item
              name="email"
              label={
                <span
                  className={`text-sm ${textSecondary} flex items-center gap-1`}
                >
                  {t("email")}
                  <LockOutlined className="text-xs text-gray-400" />
                </span>
              }
            >
              <Input
                disabled
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder={t("emailPlaceholder")}
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className={`text-sm ${textSecondary}`}>{t("phone")}</span>
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
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder={t("phonePlaceholder")}
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("address")}
                </span>
              }
              className="lg:col-span-2"
            >
              <Input.TextArea
                disabled={!isEditing}
                rows={3}
                placeholder={t("addressPlaceholder")}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Card>
  );
}
