"use client";

import React from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Divider,
  Empty,
  Select,
} from "antd";
import {
  SafetyCertificateOutlined,
  IdcardOutlined,
  BankOutlined,
  BookOutlined,
  FileTextOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { FormInstance } from "antd";
import { specializations } from "@/utils/specializations";

type Props = { form: FormInstance; isEditing: boolean; isLoading?: boolean };

export default function ProfessionalProfileCard({
  form,
  isEditing,
  isLoading,
}: Props) {
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
          <SafetyCertificateOutlined className="text-xl text-primary" />
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${textPrimary}`}>
            {t("professionalProfile")}
          </h3>
          <p className={`text-sm ${textSecondary}`}>
            {t("professionalProfileDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical">
        {/* Professional Information Section */}
        <div className="mb-4">
          <h4
            className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
          >
            <IdcardOutlined className="text-primary" />
            {t("professionalInfo")}
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Specialization */}
            <Form.Item
              name={["doctorInfo", "specialization"]}
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("specialization")}
                </span>
              }
            >
              <Select
                disabled={!isEditing}
                placeholder={t("specializationPlaceholder")}
                options={specializations.map((spec) => ({
                  value: spec.value,
                  label: t(spec.labelKey),
                }))}
              />
            </Form.Item>

            {/* License Number */}
            <Form.Item
              name={["doctorInfo", "licenseNumber"]}
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("licenseNumber")}
                </span>
              }
            >
              <Input
                disabled={!isEditing}
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder={t("licensePlaceholder")}
                className="h-10"
              />
            </Form.Item>

            {/* Years of Experience */}
            <Form.Item
              name={["doctorInfo", "yearsOfExperience"]}
              label={
                <span className={`text-sm ${textSecondary}`}>
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
                className="w-full h-10"
                min={0}
                placeholder={t("yearsPlaceholder")}
              />
            </Form.Item>

            {/* Hospital */}
            <Form.Item
              name={["doctorInfo", "hospital"]}
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("hospital")}
                </span>
              }
            >
              <Input
                disabled={!isEditing}
                prefix={<BankOutlined className="text-gray-400" />}
                placeholder={t("hospitalPlaceholder")}
                className="h-10"
              />
            </Form.Item>

            {/* Consultation Fee */}
            <Form.Item
              label={
                <span className={`text-sm ${textSecondary}`}>
                  {t("consultationFee")}
                </span>
              }
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full h-10"
                    min={0}
                    prefix="₫"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) =>
                      parseInt(value?.replace(/\₫\s?|(,*)/g, "") || "0", 10) ||
                      0
                    }
                    placeholder={t("minFeePlaceholder")}
                  />
                </Form.Item>

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
                    className="w-full h-10"
                    min={0}
                    prefix="₫"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) =>
                      parseInt(value?.replace(/\₫\s?|(,*)/g, "") || "0", 10) ||
                      0
                    }
                    placeholder={t("maxFeePlaceholder")}
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </div>
        </div>

        <Divider className={isDark ? "border-gray-700" : "border-gray-200"} />

        {/* Education Section */}
        <div className="mb-4">
          <h4
            className={`text-sm font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
          >
            <BookOutlined className="text-primary" />
            {t("education")}
          </h4>

          <Form.List name={["doctorInfo", "education"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && !isEditing ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className={textSecondary}>
                        {t("noEducationYet")}
                      </span>
                    }
                    className="py-2"
                  />
                ) : (
                  fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-center gap-2 mb-3">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        noStyle
                        className="flex-1"
                      >
                        <Input
                          disabled={!isEditing}
                          className="h-10"
                          placeholder={t("educationPlaceholder")}
                        />
                      </Form.Item>
                      {isEditing && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="text-red-500 text-lg hover:text-red-600 cursor-pointer"
                        />
                      )}
                    </div>
                  ))
                )}

                {isEditing && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      className="w-full h-10"
                    >
                      {t("addEducation")}
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </div>

        <Divider className={isDark ? "border-gray-700" : "border-gray-200"} />

        {/* Bio Section */}
        <div>
          <h4
            className={`text-sm font-semibold ${textPrimary} mb-4 flex items-center gap-2`}
          >
            <FileTextOutlined className="text-primary" />
            {t("bio")}
          </h4>

          <Form.Item name={["doctorInfo", "bio"]}>
            <Input.TextArea
              disabled={!isEditing}
              rows={4}
              maxLength={500}
              showCount
              placeholder={t("bioPlaceholder")}
            />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
