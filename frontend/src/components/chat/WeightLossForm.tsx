"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Alert,
  Row,
  Col,
} from "antd";
import { useTranslations } from "next-intl";

interface WeightLossData {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  exerciseTime: number;
}

interface WeightLossFormProps {
  onSubmit: (data: WeightLossData) => Promise<void>;
  loading: boolean;
  isDark: boolean;
  onCancel?: () => void;
}

export default function WeightLossForm({
  onSubmit,
  loading,
  isDark,
  onCancel,
}: WeightLossFormProps) {
  const t = useTranslations("weightLoss");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: WeightLossData) => {
    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const bgClass = isDark ? "bg-gray-900" : "bg-[#f9fafb]";
  const textColor = isDark ? "text-white" : "text-gray-900";

  return (
    <div className="space-y-4 px-2 ">
      <Alert
        message={t("alertMessage")}
        type="info"
        showIcon
        className="mb-4"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={`p-4 rounded-lg border border-transparent ${bgClass}`}
      >
        {/* Tên */}
        <Form.Item
          name="name"
          label={<span className={textColor}>{t("name")}</span>}
          rules={[{ required: true, message: t("nameRequired") }]}
        >
          <Input
            placeholder={t("namePlaceholder")}
            className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="age"
              label={<span className={textColor}>{t("age")}</span>}
              rules={[
                { required: true, message: t("ageRequired") },
                {
                  type: "number",
                  min: 13,
                  max: 100,
                  message: t("ageRange"),
                },
              ]}
            >
              <InputNumber
                min={13}
                max={100}
                className="w-full"
                placeholder={t("agePlaceholder")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="height"
              label={<span className={textColor}>{t("height")}</span>}
              rules={[
                { required: true, message: t("heightRequired") },
                {
                  type: "number",
                  min: 100,
                  max: 250,
                  message: t("heightRange"),
                },
              ]}
            >
              <InputNumber
                min={100}
                max={250}
                className="w-full"
                placeholder={t("heightPlaceholder")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="weight"
              label={<span className={textColor}>{t("weight")}</span>}
              rules={[
                { required: true, message: t("weightRequired") },
                {
                  type: "number",
                  min: 30,
                  max: 200,
                  message: t("weightRange"),
                },
              ]}
            >
              <InputNumber
                min={30}
                max={200}
                className="w-full"
                placeholder={t("weightPlaceholder")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="goalWeight"
              label={<span className={textColor}>{t("goalWeight")}</span>}
              rules={[
                { required: true, message: t("goalWeightRequired") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const weight = getFieldValue("weight");
                    if (!value || !weight) {
                      return Promise.resolve();
                    }
                    if (value < weight) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("goalWeightMustBeLessThanCurrent")),
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder={t("goalWeightPlaceholder")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Thời gian tập luyện */}
        <Form.Item
          name="exerciseTime"
          label={<span className={textColor}>{t("exerciseTime")}</span>}
          rules={[
            { required: true, message: t("exerciseTimeRequired") },
            {
              type: "number",
              min: 0,
              max: 240,
              message: t("exerciseTimeRange"),
            },
          ]}
        >
          <Select placeholder={t("exerciseTimePlaceholder")}>
            <Select.Option value={0}>{t("exerciseOption0")}</Select.Option>
            <Select.Option value={15}>{t("exerciseOption15")}</Select.Option>
            <Select.Option value={30}>{t("exerciseOption30")}</Select.Option>
            <Select.Option value={60}>{t("exerciseOption60")}</Select.Option>
            <Select.Option value={90}>{t("exerciseOption90")}</Select.Option>
            <Select.Option value={120}>{t("exerciseOption120")}</Select.Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <div className="flex gap-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting || loading}
              disabled={submitting || loading}
              className="rounded-lg flex-1"
            >
              {submitting || loading ? t("creating") : t("createButton")}
            </Button>
            <Button
              htmlType="reset"
              onClick={handleReset}
              disabled={submitting || loading}
              className="rounded-lg"
            >
              {t("reset")}
            </Button>
          </div>
        </Form.Item>

        {/* Cancel Button */}
        {onCancel && (
          <Button
            block
            onClick={onCancel}
            disabled={submitting || loading}
            className="rounded-lg"
          >
            {t("cancel")}
          </Button>
        )}
      </Form>
    </div>
  );
}
