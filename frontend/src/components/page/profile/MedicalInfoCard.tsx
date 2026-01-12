"use client";

import React from "react";
import { Card, Form, Select, Empty, Tag } from "antd";
import {
  MedicineBoxOutlined,
  AlertOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = { form: any; isEditing: boolean };

export default function MedicalInfoCard({ form, isEditing }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900"
    : "bg-gradient-to-br from-white via-red-50/30 to-pink-50/20";

  const cardBorder = isDark
    ? "border-2 border-gray-700/50"
    : "border-2 border-red-100/50";

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
      {/* Card Header with Icon - RED THEME */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-red-500 to-pink-500">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl blur opacity-50"></div>
          <div className="relative p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
            <MedicineBoxOutlined className="text-3xl text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            {t("medicalInfo")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("medicalInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" size="large">
        {/* Medical History */}
        <Form.Item
          name="medicalHistory"
          label={
            <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
              <MedicineBoxOutlined className="text-red-500 text-lg" />
              {t("medicalHistory")}
            </span>
          }
        >
          <Select
            mode="tags"
            disabled={!isEditing}
            placeholder={
              <span className="flex items-center gap-2">
                <PlusOutlined />
                {t("addMedicalHistory")}
              </span>
            }
            className="w-full"
            tagRender={(props) => (
              <Tag
                color="red"
                closable={isEditing && props.closable}
                onClose={props.onClose}
                className="text-sm py-1 px-3 rounded-lg"
              >
                {props.label}
              </Tag>
            )}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-4">
                    <MedicineBoxOutlined className="text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t("noMedicalHistory")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("addMedicalHistoryHint")}
                    </p>
                  </div>
                }
              />
            }
          />
        </Form.Item>

        {/* Allergies */}
        <Form.Item
          name="allergies"
          label={
            <span className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
              <AlertOutlined className="text-orange-500 text-lg" />
              {t("allergies")}
            </span>
          }
        >
          <Select
            mode="tags"
            disabled={!isEditing}
            placeholder={
              <span className="flex items-center gap-2">
                <PlusOutlined />
                {t("addAllergies")}
              </span>
            }
            className="w-full"
            tagRender={(props) => (
              <Tag
                color="orange"
                closable={isEditing && props.closable}
                onClose={props.onClose}
                className="text-sm py-1 px-3 rounded-lg"
              >
                {props.label}
              </Tag>
            )}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-4">
                    <AlertOutlined className="text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t("noAllergies")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("addAllergiesHint")}
                    </p>
                  </div>
                }
              />
            }
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
