"use client";

import React from "react";
import { Card, Form, Input, InputNumber } from "antd";
import {
  SafetyCertificateOutlined,
  IdcardOutlined,
  TrophyOutlined,
  BankOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = { form: any; isEditing: boolean };

export default function ProfessionalInfoCard({ form, isEditing }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-linear-to-br from-gray-800 via-gray-850 to-gray-900"
    : "bg-linear-to-br from-white via-indigo-50/30 to-purple-50/20";

  const cardBorder = isDark
    ? "border-2 border-gray-700/50"
    : "border-2 border-indigo-100/50";

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
      {/* Card Header with Icon - INDIGO THEME */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-linear-to-r from-indigo-500 to-purple-500">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl blur opacity-50"></div>
          <div className="relative p-4 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
            <SafetyCertificateOutlined className="text-3xl text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("professionalInfo")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("professionalInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" size="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Specialization */}
          <Form.Item
            name={["doctorInfo", "specialization"]}
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <SafetyCertificateOutlined className="text-indigo-500 text-lg" />
                {t("specialization")}
              </span>
            }
          >
            <Input
              disabled={!isEditing}
              className={`h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-indigo-300 focus:border-indigo-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              prefix={<SafetyCertificateOutlined className="text-indigo-500" />}
              placeholder={t("specializationPlaceholder")}
            />
          </Form.Item>

          {/* License Number */}
          <Form.Item
            name={["doctorInfo", "licenseNumber"]}
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <IdcardOutlined className="text-blue-500 text-lg" />
                {t("licenseNumber")}
              </span>
            }
          >
            <Input
              disabled={!isEditing}
              className={`h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-blue-300 focus:border-blue-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              prefix={<IdcardOutlined className="text-blue-500" />}
              placeholder={t("licensePlaceholder")}
            />
          </Form.Item>

          {/* Years of Experience */}
          <Form.Item
            name={["doctorInfo", "yearsOfExperience"]}
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <TrophyOutlined className="text-yellow-500 text-lg" />
                {t("yearsOfExperience")}
              </span>
            }
            rules={[
              {
                type: "number",
                min: 0,
                message: t("mustBePositive"),
              },
            ]}
          >
            <InputNumber
              disabled={!isEditing}
              className={`w-full h-12 rounded-xl ${
                isEditing ? "border-2 border-yellow-300" : ""
              }`}
              min={0}
              prefix={<TrophyOutlined className="text-yellow-500" />}
              placeholder={t("yearsPlaceholder")}
            />
          </Form.Item>

          {/* Hospital */}
          <Form.Item
            name={["doctorInfo", "hospital"]}
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <BankOutlined className="text-green-500 text-lg" />
                {t("hospital")}
              </span>
            }
          >
            <Input
              disabled={!isEditing}
              className={`h-12 rounded-xl ${
                isEditing
                  ? "border-2 border-green-300 focus:border-green-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
              prefix={<BankOutlined className="text-green-500" />}
              placeholder={t("hospitalPlaceholder")}
            />
          </Form.Item>

          {/* Consultation Fee - FULL WIDTH */}
          <Form.Item
            label={
              <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                <DollarOutlined className="text-green-500 text-lg" />
                {t("consultationFee")}
              </span>
            }
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("minFee")}
                </label>
                <Form.Item
                  name={["doctorInfo", "consultationFee", "min"]}
                  noStyle
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: t("mustBePositive"),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={!isEditing}
                    className={`w-full h-12 rounded-xl ${
                      isEditing ? "border-2 border-green-300" : ""
                    }`}
                    min={0}
                    prefix="₫"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\₫\s?|(,*)/g, "")}
                    placeholder={t("minFeePlaceholder")}
                  />
                </Form.Item>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("maxFee")}
                </label>
                <Form.Item
                  name={["doctorInfo", "consultationFee", "max"]}
                  noStyle
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: t("mustBePositive"),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={!isEditing}
                    className={`w-full h-12 rounded-xl ${
                      isEditing ? "border-2 border-green-300" : ""
                    }`}
                    min={0}
                    prefix="₫"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\₫\s?|(,*)/g, "")}
                    placeholder={t("maxFeePlaceholder")}
                  />
                </Form.Item>
              </div>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
