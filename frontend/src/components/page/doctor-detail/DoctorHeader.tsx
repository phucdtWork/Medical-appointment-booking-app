"use client";

import React from "react";
import { Card, Tag, Rate, Tooltip } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { FC, ReactNode } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { Doctor } from "@/types/doctor";
import Image from "next/image";
import { formatCurrency, formatPriceRange } from "@/utils/currency";
import { truncateText, getTextWithTooltip } from "@/utils/text";

interface DoctorHeaderProps {
  doctor: Doctor;
}

interface StatItemProps {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  highlight?: boolean;
  tooltip?: string;
}

export default function DoctorHeader({ doctor }: DoctorHeaderProps) {
  const { isDark } = useTheme();
  const t = useTranslations("doctorDetail.doctorHeader");
  const locale = useLocale();

  // Type component StatItem
  const StatItem: FC<StatItemProps> = ({
    icon,
    label,
    value,
    highlight = false,
    tooltip,
  }) => (
    <Tooltip title={tooltip} arrow>
      <div
        className={`flex items-center justify-between py-3 px-4 rounded-lg border transition-all cursor-default ${
          isDark
            ? "border-blue-800 bg-slate-800/50 hover:border-blue-600"
            : "border-blue-100 bg-white hover:border-blue-300"
        }`}
        style={{
          borderColor: "var(--primary-color)",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`text-xl shrink-0`}
            style={{ color: "var(--primary-color)" }}
          >
            {icon}
          </span>
          <span
            className={`text-sm truncate ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {label}
          </span>
        </div>
        <span
          className={`text-base font-semibold shrink-0 ml-2 ${
            highlight
              ? isDark
                ? "text-blue-400"
                : "text-blue-600"
              : isDark
                ? "text-blue-300"
                : "text-blue-500"
          }`}
          style={{ color: "var(--primary-color)" }}
        >
          {value}
        </span>
      </div>
    </Tooltip>
  );

  // Helper function để truncate hospital name
  const hospitalText = getTextWithTooltip(doctor.doctorInfo.hospital, 20);

  const feeText = formatPriceRange(
    doctor.doctorInfo.consultationFee.min,
    doctor.doctorInfo.consultationFee.max,
    locale === "vi" ? "VND" : "USD"
  );

  return (
    <div className="w-full max-w-full pb-6">
      <Card
        className={`shadow-md border-2`}
        style={{
          borderColor: "var(--primary-color)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left: Avatar & Basic Info */}
          <div
            className={`flex flex-col items-center pb-6 lg:pb-0 lg:border-r-2 lg:pr-8`}
            style={{
              borderColor: "var(--primary-color)",
            }}
          >
            <div className="relative w-36 h-36 mb-5">
              <Image
                src={doctor.avatar}
                alt={doctor.fullName}
                width={144}
                height={144}
                className={`w-full h-full rounded-full object-cover border-4 shadow-lg`}
                style={{
                  borderColor: "var(--primary-color)",
                }}
              />
            </div>

            <h1
              className={`text-2xl font-bold text-center mb-3 ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {doctor.fullName}
            </h1>

            <Tag
              className={`mb-4 px-4 py-1 text-sm font-medium border`}
              style={{
                borderColor: "var(--primary-color)",
                backgroundColor: isDark
                  ? "rgba(24, 144, 255, 0.1)"
                  : "rgba(24, 144, 255, 0.05)",
                color: "var(--primary-color)",
              }}
            >
              {t(`specializations.${doctor.doctorInfo.specialization}`)}
            </Tag>

            <div
              className={`flex mt-4 items-center gap-3 p-4 rounded-lg border`}
              style={{
                borderColor: "var(--primary-color)",
                backgroundColor: isDark
                  ? "rgba(24, 144, 255, 0.05)"
                  : "rgba(24, 144, 255, 0.02)",
              }}
            >
              <Rate
                disabled
                defaultValue={doctor.doctorInfo.rating}
                allowHalf
                className="text-base"
                style={{ color: "var(--primary-color)" }}
              />
              <div className="text-base">
                <span
                  className={`font-bold`}
                  style={{ color: "var(--primary-color)" }}
                >
                  {doctor.doctorInfo.rating}
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  {" "}
                  ({doctor.doctorInfo.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stats Grid - Full Width */}
          <div className="flex flex-col justify-center">
            <h2
              className={`text-xl font-semibold mb-5 pb-3 border-b-2 ${
                isDark ? "text-slate-100" : "text-slate-700"
              }`}
              style={{ borderColor: "var(--primary-color)" }}
            >
              {t("detailsTitle")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <StatItem
                icon={<TeamOutlined />}
                label={t("stats.totalPatients")}
                value={doctor.doctorInfo.totalPatients.toLocaleString(locale)}
                highlight
              />

              <StatItem
                icon={<StarOutlined />}
                label={t("stats.rating")}
                value={`${doctor.doctorInfo.rating}/5.0`}
                highlight
              />

              <StatItem
                icon={<TrophyOutlined />}
                label={t("stats.experience")}
                value={`${doctor.doctorInfo.yearsOfExperience} ${t("stats.years")}`}
              />

              <StatItem
                icon={<UserOutlined />}
                label={t("stats.reviews")}
                value={doctor.doctorInfo.totalReviews.toLocaleString(locale)}
              />

              <StatItem
                icon={<MedicineBoxOutlined />}
                label={t("stats.hospital")}
                value={hospitalText.display}
                tooltip={
                  hospitalText.shouldShowTooltip
                    ? hospitalText.tooltip
                    : undefined
                }
              />

              <StatItem
                icon={<DollarOutlined />}
                label={t("stats.fee")}
                value={feeText}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
