"use client";

import React from "react";
import { Card, Form, Input, Button, Empty } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

type Props = { form: any; isEditing: boolean };

export default function EducationBioCard({ form, isEditing }: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-800 to-gray-900"
    : "bg-gradient-to-br from-white to-blue-50";

  const educationList = form.getFieldValue(["doctorInfo", "education"]) || [];

  return (
    <Card
      className={`
        ${cardBg}
        shadow-lg rounded-2xl mb-6 p-6
        border border-gray-200 dark:border-gray-700
        transition-all duration-300
        hover:shadow-xl hover:scale-[1.01]
      `}
      variant="plain"
    >
      {/* Card Header with Icon */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <BookOutlined className="text-xl text-purple-500" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {t("educationAndBio")}
        </h3>
      </div>

      <Form form={form} layout="vertical">
        {/* Education Section */}
        <div className="mb-6">
          <label className="flex items-center gap-2 mb-3 font-medium text-gray-700 dark:text-gray-300">
            <BookOutlined className="text-purple-500" />
            {t("education")}
          </label>

          <Form.List name={["doctorInfo", "education"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && !isEditing ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-gray-500 dark:text-gray-400">
                        {t("noEducationYet")}
                      </span>
                    }
                    className="py-4"
                  />
                ) : (
                  fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-center gap-2 mb-3">
                      <Form.Item
                        key={key}
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
                          className="text-red-500 text-lg hover:text-red-600 cursor-pointer transition-colors"
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

        {/* Bio Section */}
        <Form.Item
          name={["doctorInfo", "bio"]}
          label={
            <span className="flex items-center gap-2">
              <FileTextOutlined className="text-blue-500" />
              {t("bio")}
            </span>
          }
        >
          <Input.TextArea
            disabled={!isEditing}
            rows={4}
            maxLength={500}
            showCount
            placeholder={t("bioPlaceholder")}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
