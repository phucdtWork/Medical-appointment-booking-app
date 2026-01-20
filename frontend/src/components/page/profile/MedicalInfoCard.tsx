"use client";

import React, { useState, useEffect } from "react";
import { Card, Form, Select, Empty, Tag } from "antd";
import {
  MedicineBoxOutlined,
  AlertOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { medicalDataService } from "@/lib/services/medicalDataService";
import { FormInstance } from "antd";

type Props = { form: FormInstance; isEditing: boolean; isLoading?: boolean };

export default function MedicalInfoCard({ form, isEditing, isLoading }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [loadingConditions, setLoadingConditions] = useState(false);
  const [loadingAllergies, setLoadingAllergies] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoadingConditions(true);
      setLoadingAllergies(true);
      const [conditionsData, allergiesData] = await Promise.all([
        medicalDataService.getMedicalConditions(),
        medicalDataService.getAllergies(),
      ]);
      setConditions(conditionsData);
      setAllergies(allergiesData);
      setLoadingConditions(false);
      setLoadingAllergies(false);
    };
    loadData();
  }, []);

  // Handle search/filter
  const handleConditionsSearch = async (value: string) => {
    if (value) {
      setLoadingConditions(true);
      const filtered = await medicalDataService.getMedicalConditions(value);
      setConditions(filtered);
      setLoadingConditions(false);
    } else {
      setLoadingConditions(true);
      const all = await medicalDataService.getMedicalConditions();
      setConditions(all);
      setLoadingConditions(false);
    }
  };

  const handleAllergiesSearch = async (value: string) => {
    if (value) {
      setLoadingAllergies(true);
      const filtered = await medicalDataService.getAllergies(value);
      setAllergies(filtered);
      setLoadingAllergies(false);
    } else {
      setLoadingAllergies(true);
      const all = await medicalDataService.getAllergies();
      setAllergies(all);
      setLoadingAllergies(false);
    }
  };

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
        hover:shadow-md hover:border-primary pt-3
      `}
      loading={isLoading}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MedicineBoxOutlined className="text-xl text-primary" />
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${textPrimary}`}>
            {t("medicalInfo")}
          </h3>
          <p className={`text-sm ${textSecondary}`}>
            {t("medicalInfoDescription")}
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Medical History */}
          <Form.Item
            name="medicalHistory"
            label={
              <span
                className={`text-sm ${textSecondary} flex items-center gap-2`}
              >
                <MedicineBoxOutlined className="text-primary" />
                {t("medicalHistory")}
              </span>
            }
            normalize={(value) => (Array.isArray(value) ? value : [])}
            help={
              isEditing ? (
                <span className={`text-xs ${textSecondary}`}>
                  {t("addMedicalHistoryHint")}
                </span>
              ) : null
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
              options={conditions.map((c) => ({ label: c, value: c }))}
              onSearch={handleConditionsSearch}
              loading={loadingConditions}
              filterOption={false}
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className={textSecondary}>
                      {t("noMedicalHistory")}
                    </span>
                  }
                />
              }
              tagRender={(props) => (
                <Tag
                  color="blue"
                  closable={isEditing && props.closable}
                  onClose={props.onClose}
                  className="text-sm py-1 px-2"
                >
                  {props.label}
                </Tag>
              )}
            />
          </Form.Item>

          {/* Allergies */}
          <Form.Item
            name="allergies"
            label={
              <span
                className={`text-sm ${textSecondary} flex items-center gap-2`}
              >
                <AlertOutlined className="text-orange-500" />
                {t("allergies")}
              </span>
            }
            normalize={(value) => (Array.isArray(value) ? value : [])}
            help={
              isEditing ? (
                <span className={`text-xs ${textSecondary}`}>
                  {t("addAllergiesHint")}
                </span>
              ) : null
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
              options={allergies.map((a) => ({ label: a, value: a }))}
              onSearch={handleAllergiesSearch}
              loading={loadingAllergies}
              filterOption={false}
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className={textSecondary}>{t("noAllergies")}</span>
                  }
                />
              }
              tagRender={(props) => (
                <Tag
                  color="orange"
                  closable={isEditing && props.closable}
                  onClose={props.onClose}
                  className="text-sm py-1 px-2"
                >
                  {props.label}
                </Tag>
              )}
            />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
