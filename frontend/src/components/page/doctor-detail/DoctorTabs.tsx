/* eslint-disable */
"use client";

import React, { useState } from "react";
import { Card, Tabs, Rate, Avatar, Collapse, Pagination } from "antd";
import type { CollapseProps, TabsProps } from "antd";
import {
  UserOutlined,
  StarOutlined,
  BookOutlined,
  ThunderboltOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { Doctor } from "@/types/doctor";
import { useTheme } from "@/providers/ThemeProvider";

const mockReviews = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    rating: 5,
    date: "15/11/2024",
    comment: "Bác sĩ tận tâm, khám bệnh kỹ lưỡng. Rất hài lòng với dịch vụ!",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    rating: 4.5,
    date: "10/11/2024",
    comment:
      "Bác sĩ giải thích rất dễ hiểu, chuyên môn cao. Đặt lịch lại lần sau.",
  },
  {
    id: 3,
    patientName: "Lê Văn C",
    rating: 5,
    date: "05/11/2024",
    comment: "Thái độ thân thiện, tư vấn chu đáo. Recommend!",
  },
  {
    id: 4,
    patientName: "Phạm Văn D",
    rating: 4,
    date: "01/11/2024",
    comment: "Bác sĩ có kinh nghiệm, điều trị hiệu quả.",
  },
  {
    id: 5,
    patientName: "Hoàng Thị E",
    rating: 5,
    date: "28/10/2024",
    comment: "Rất hài lòng, sẽ tái khám.",
  },
  {
    id: 6,
    patientName: "Vũ Văn F",
    rating: 4.5,
    date: "25/10/2024",
    comment: "Khám kỹ lưỡng, giải thích dễ hiểu.",
  },
  {
    id: 7,
    patientName: "Đặng Thị G",
    rating: 5,
    date: "20/10/2024",
    comment: "Bác sĩ tuyệt vời, rất được khuyên dùng.",
  },
  {
    id: 8,
    patientName: "Tạ Văn H",
    rating: 4,
    date: "15/10/2024",
    comment: "Dịch vụ tốt, giá cả hợp lý.",
  },
];

interface Review {
  id: string | number;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
}

interface DoctorTabsProps {
  doctor?: Doctor;
  reviews?: Review[];
  isDark?: boolean;
}

const REVIEWS_PER_PAGE = 3;

export default function DoctorTabs({
  doctor,
  reviews = mockReviews,
}: DoctorTabsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("doctorDetail");

  const { isDark } = useTheme();

  const StatBox = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }) => (
    <div
      className={`p-4 rounded-lg border-2 text-center transition-all`}
      style={{
        borderColor: "var(--primary-color)",
        backgroundColor: isDark
          ? "rgba(24, 144, 255, 0.1)"
          : "rgba(24, 144, 255, 0.05)",
      }}
    >
      <div className="text-2xl mb-1" style={{ color: "var(--primary-color)" }}>
        {icon}
      </div>
      <div
        className="text-3xl font-bold mb-1"
        style={{ color: "var(--primary-color)" }}
      >
        {value}
      </div>
      <div
        className={`text-sm ${
          isDark ? "text-text-secondary-dark" : "text-text-secondary"
        }`}
      >
        {label}
      </div>
    </div>
  );

  const collapseItemStyle = {
    borderColor: "var(--primary-color)",
    backgroundColor: isDark
      ? "rgba(24, 144, 255, 0.05)"
      : "rgba(24, 144, 255, 0.02)",
  };

  const infoItems: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-3">
          <BookOutlined
            className="text-xl"
            style={{ color: "var(--primary-color)" }}
          />
          <span
            className={`font-semibold ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {t("tabs.education")}
          </span>
        </div>
      ),
      children: (
        <ul className="list-disc list-inside space-y-2">
          {doctor?.doctorInfo.education.map((edu: string, index: number) => (
            <li
              key={index}
              className={
                isDark ? "text-text-secondary-dark" : "text-text-secondary"
              }
            >
              {edu}
            </li>
          ))}
        </ul>
      ),
      className: "mb-3 rounded-lg border-2 overflow-hidden",
      style: collapseItemStyle,
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-3">
          <ThunderboltOutlined
            className="text-xl"
            style={{ color: "var(--primary-color)" }}
          />
          <span
            className={`font-semibold ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {t("tabs.experience")}
          </span>
        </div>
      ),
      children: (
        <p
          className={
            isDark ? "text-text-secondary-dark" : "text-text-secondary"
          }
        >
          {doctor?.doctorInfo.bio}
        </p>
      ),
      className: "mb-3 rounded-lg border-2 overflow-hidden",
      style: collapseItemStyle,
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-3">
          <MedicineBoxOutlined
            className="text-xl"
            style={{ color: "var(--primary-color)" }}
          />
          <span
            className={`font-semibold ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {t("tabs.hospital")}
          </span>
        </div>
      ),
      children: (
        <div className="space-y-2">
          <p
            className={
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }
          >
            {doctor?.doctorInfo.hospital}
          </p>
          <p
            className={`text-sm ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            📍 {doctor?.address}
          </p>
        </div>
      ),
      className: "mb-3 rounded-lg border-2 overflow-hidden",
      style: collapseItemStyle,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-3">
          <SafetyCertificateOutlined
            className="text-xl"
            style={{ color: "var(--primary-color)" }}
          />
          <span
            className={`font-semibold ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {t("tabs.license")}
          </span>
        </div>
      ),
      children: (
        <p
          className="font-mono"
          style={{
            color: "var(--primary-color)",
          }}
        >
          {doctor?.doctorInfo.licenseNumber}
        </p>
      ),
      className: "mb-3 rounded-lg border-2 overflow-hidden",
      style: collapseItemStyle,
    },
  ];

  // Tính toán pagination
  const totalReviews = reviews.length;
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to reviews section
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Tab items
  const tabItems: TabsProps["items"] = [
    {
      key: "info",
      label: t("tabs.info"),
      children: (
        <div>
          <Collapse
            items={infoItems}
            defaultActiveKey={["1"]}
            bordered={false}
            style={{
              background: "transparent",
            }}
            className="overflow-visible"
          />
        </div>
      ),
    },
    {
      key: "reviews",
      label: `${t("tabs.reviews")} (${reviews.length})`,
      children: (
        <div id="reviews-section" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox
              icon={<StarOutlined />}
              label={t("doctorHeader.stats.rating")}
              value={doctor?.doctorInfo.rating || 0}
            />
            <StatBox
              icon={<TeamOutlined />}
              label={t("doctorHeader.stats.reviews")}
              value={doctor?.doctorInfo.totalReviews || 0}
            />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-4 rounded-lg border-2 transition-all`}
                  style={{
                    borderColor: "var(--primary-color)",
                    backgroundColor: isDark
                      ? "rgba(24, 144, 255, 0.05)"
                      : "rgba(24, 144, 255, 0.02)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      className="shrink-0"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-semibold ${
                            isDark
                              ? "text-text-primary-dark"
                              : "text-text-primary"
                          }`}
                        >
                          {review.patientName}
                        </h4>
                        <span
                          className={`text-sm ${
                            isDark
                              ? "text-text-secondary-dark"
                              : "text-text-secondary"
                          }`}
                        >
                          {review.date}
                        </span>
                      </div>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        allowHalf
                        className="text-sm mb-2"
                        style={{ color: "var(--primary-color)" }}
                      />
                      <p
                        className={
                          isDark
                            ? "text-text-secondary-dark"
                            : "text-text-secondary"
                        }
                      >
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p
                className={`text-center py-8 ${
                  isDark ? "text-text-secondary-dark" : "text-text-secondary"
                }`}
              >
                {t("booking.loading")}
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalReviews > REVIEWS_PER_PAGE && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalReviews}
                pageSize={REVIEWS_PER_PAGE}
                onChange={handlePageChange}
                showSizeChanger={false}
                style={
                  {
                    "--ant-primary-color": "var(--primary-color)",
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        className={`shadow-md border-2`}
        style={{
          borderColor: "var(--primary-color)",
        }}
      >
        <Tabs items={tabItems} />
      </Card>
    </>
  );
}
