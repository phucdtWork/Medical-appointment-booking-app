"use client";

import React from "react";
import { Card, Tag, Empty, Alert } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface FeaturesDisplayProps {
  answer: string;
  features: Feature[];
  isRelevant: boolean;
  isDark?: boolean;
}

export default function FeaturesDisplay({
  answer,
  features,
  isRelevant,
  isDark = false,
}: FeaturesDisplayProps) {
  const { isDark: themeDark } = useTheme();
  const dark = isDark || themeDark;

  const cardBg = dark ? "bg-gray-800" : "bg-white";
  const borderColor = dark ? "border-gray-700" : "border-gray-200";
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-600";

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      "Appointment Management": "blue",
      "Quản Lý Lịch Hẹn": "blue",
      "Doctor Information": "purple",
      "Thông Tin Bác Sĩ": "purple",
      "Health Records": "green",
      "Hồ Sơ Sức Khỏe": "green",
      "Health Services": "orange",
      "Dịch Vụ Sức Khỏe": "orange",
      Notifications: "cyan",
      "Thông Báo": "cyan",
      Accessibility: "magenta",
      "Khả Năng Truy Cập": "magenta",
    };
    return colorMap[category] || "default";
  };

  // Format answer text - convert **text** to bold
  const formatAnswer = (text: string) => {
    return text.split(/(\*\*.+?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Answer Card */}
      {!isRelevant && (
        <Alert
          message={answer}
          type="info"
          showIcon
          className={`rounded-lg ${dark ? "bg-blue-900 text-blue-100" : ""}`}
        />
      )}

      {isRelevant && (
        <Card
          className={`rounded-lg border ${borderColor} ${cardBg}`}
          style={{ backgroundColor: dark ? "#1f2937" : undefined }}
        >
          <div className={`${textPrimary} whitespace-pre-wrap leading-relaxed`}>
            {formatAnswer(answer)}
          </div>
        </Card>
      )}

      {/* Features List */}
      {features.length > 0 && isRelevant && (
        <div className="space-y-3">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`rounded-lg border ${borderColor} cursor-pointer transition-all hover:shadow-md ${cardBg}`}
              style={{ backgroundColor: dark ? "#1f2937" : undefined }}
              hoverable
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4
                    className={`font-semibold ${textPrimary} flex items-center gap-2`}
                  >
                    <FireOutlined style={{ color: "#ff7a45" }} />
                    {feature.name}
                  </h4>
                  <Tag color={getCategoryColor(feature.category)}>
                    {feature.category}
                  </Tag>
                </div>
                <p className={`${textSecondary} text-sm`}>
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {features.length === 0 && isRelevant && (
        <Empty description="No features found" />
      )}
    </div>
  );
}
