"use client";

import React from "react";
import { Card, Row, Col } from "antd";
import {
  StarFilled,
  UserOutlined,
  FileDoneOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

interface DoctorInfo {
  rating: number;
  totalReviews: number;
  totalPatients: number;
}

interface User {
  doctorInfo?: DoctorInfo;
}

export default function StatisticsCard({ user }: { user: User | undefined }) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const rating = user?.doctorInfo?.rating ?? 0;
  const reviews = user?.doctorInfo?.totalReviews ?? 0;
  const patients = user?.doctorInfo?.totalPatients ?? 0;

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
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <LineChartOutlined className="text-xl text-primary" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${textPrimary}`}>
            {t("statistics")}
          </h3>
          <p className={`text-xs ${textSecondary}`}>
            {t("statisticsDescription")}
          </p>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Rating */}
        <Col xs={24} sm={8}>
          <div
            className={`text-center p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"} border ${borderColor}`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <StarFilled className="text-yellow-500 text-2xl" />
              <span className="text-3xl font-bold text-primary">
                {rating.toFixed(1)}
              </span>
            </div>
            <div
              className={`text-xs ${textSecondary} font-medium uppercase tracking-wide`}
            >
              {t("rating")}
            </div>
          </div>
        </Col>

        {/* Reviews */}
        <Col xs={24} sm={8}>
          <div
            className={`text-center p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"} border ${borderColor}`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileDoneOutlined className="text-primary text-2xl" />
              <span className="text-3xl font-bold text-primary">
                {reviews}+
              </span>
            </div>
            <div
              className={`text-xs ${textSecondary} font-medium uppercase tracking-wide`}
            >
              {t("reviews")}
            </div>
          </div>
        </Col>

        {/* Patients */}
        <Col xs={24} sm={8}>
          <div
            className={`text-center p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"} border ${borderColor}`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserOutlined className="text-primary text-2xl" />
              <span className="text-3xl font-bold text-primary">
                {patients}+
              </span>
            </div>
            <div
              className={`text-xs ${textSecondary} font-medium uppercase tracking-wide`}
            >
              {t("patients")}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
