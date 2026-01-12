"use client";

import React from "react";
import { Card, Row, Col } from "antd";
import {
  StarFilled,
  UserOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

export default function StatisticsCard({ user }: { user: any }) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const rating = user?.doctorInfo?.rating ?? 0;
  const reviews = user?.doctorInfo?.totalReviews ?? 0;
  const patients = user?.doctorInfo?.totalPatients ?? 0;

  const cardBg = isDark
    ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
    : "bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100";

  const cardBorder = isDark
    ? "border-2 border-blue-700/70"
    : "border-2 border-blue-300/70";

  return (
    <Card
      className={`
        ${cardBg}
        ${cardBorder}
        shadow-2xl rounded-3xl mb-8 overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-3xl hover:-translate-y-1
        relative
      `}
      variant="plain"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

      {/* Card Header with Icon - BLUE/PURPLE THEME */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-blue-300 dark:border-blue-700 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-60 animate-pulse"></div>
          <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <LineChartOutlined className="text-3xl text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t("statistics")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
            {t("statisticsDescription")}
          </p>
        </div>
      </div>

      <Row gutter={[16, 16]} className="relative z-10">
        {/* Rating - PROMINENT */}
        <Col xs={24} sm={8}>
          <div
            className={`
            text-center p-6 rounded-2xl shadow-lg
            ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900"
                : "bg-white"
            }
            border-2 border-yellow-200 dark:border-yellow-800
            transition-all duration-300 hover:shadow-xl hover:scale-105
            relative overflow-hidden
          `}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <StarFilled className="text-yellow-400 text-4xl drop-shadow-lg animate-pulse" />
                <span className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {rating.toFixed(1)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                {t("rating")}
              </div>
              <div className="mt-2 text-xs text-gray-500">{t("fiveStars")}</div>
            </div>
          </div>
        </Col>

        {/* Reviews */}
        <Col xs={24} sm={8}>
          <div
            className={`
            text-center p-6 rounded-2xl shadow-lg
            ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900"
                : "bg-white"
            }
            border-2 border-green-200 dark:border-green-800
            transition-all duration-300 hover:shadow-xl hover:scale-105
            relative overflow-hidden
          `}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <FileDoneOutlined className="text-green-500 text-4xl" />
                <span className="text-5xl font-black bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  {reviews}
                </span>
                <span className="text-2xl font-bold text-gray-400">+</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                {t("reviews")}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t("patientFeedback")}
              </div>
            </div>
          </div>
        </Col>

        {/* Patients */}
        <Col xs={24} sm={8}>
          <div
            className={`
            text-center p-6 rounded-2xl shadow-lg
            ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900"
                : "bg-white"
            }
            border-2 border-purple-200 dark:border-purple-800
            transition-all duration-300 hover:shadow-xl hover:scale-105
            relative overflow-hidden
          `}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <UserOutlined className="text-purple-500 text-4xl" />
                <span className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {patients}
                </span>
                <span className="text-2xl font-bold text-gray-400">+</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
                {t("patients")}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t("treatedSuccessfully")}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Achievement Badge - Optional */}
      <div className="mt-6 text-center relative z-10">
        <div className="mt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
            <TrophyOutlined className="text-white text-xl" />
            <span className="text-white font-bold">{t("topRatedDoctor")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
