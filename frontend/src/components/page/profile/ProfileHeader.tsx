"use client";

import React from "react";
import { Avatar, Button, Row, Col, Upload, Badge } from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import type { User } from "@/types/user";

type Props = {
  user: User | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAvatarChange: (file: any) => void;
};

export default function ProfileHeader({
  user,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onAvatarChange,
}: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const bgGradient = isDark ? "bg-gray-900" : "bg-white";

  const bgBlueBlur = isDark ? "bg-blue-700" : "bg-blue-100";
  const bgPurpleBlur = isDark ? "bg-purple-700" : "bg-purple-100";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <section className={`relative ${bgGradient} py-20 overflow-hidden`}>
      {/* Background blur effects - VERY IMPORTANT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 ${bgBlueBlur} rounded-full opacity-20 blur-3xl animate-float`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 ${bgPurpleBlur} rounded-full opacity-20 blur-3xl animate-float-delayed`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Row gutter={[32, 32]} align="middle">
          {/* Avatar Section */}
          <Col xs={24} sm={24} md={6} lg={5} xl={4}>
            <div className="flex justify-center md:justify-start">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  if (isEditing) {
                    onAvatarChange(file);
                  }
                  return false;
                }}
                disabled={!isEditing}
              >
                <div className="relative group cursor-pointer">
                  {/* Gradient border wrapper - MAKE IT STAND OUT */}
                  <div className="p-1.5 rounded-full shadow transform transition-all duration-300 group-hover:scale-105">
                    <div className="p-1 bg-white dark:bg-gray-800 rounded-full border">
                      <Avatar
                        size={140}
                        src={user?.avatar}
                        icon={<UserOutlined className="text-5xl" />}
                        className="bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Upload overlay - VISIBLE HINT */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                      <CameraOutlined className="text-white text-3xl mb-1" />
                      <span className="text-white text-xs font-medium">
                        {t("changePhoto")}
                      </span>
                    </div>
                  )}

                  {/* Online badge */}
                  <Badge
                    status="success"
                    className="absolute bottom-3 right-3"
                    dot
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              </Upload>
            </div>
          </Col>

          {/* User Info Section */}
          <Col xs={24} sm={24} md={12} lg={13} xl={14}>
            <div className="text-center md:text-left">
              {/* Name with gradient */}
              <h1
                className={`text-3xl md:text-4xl font-semibold ${textPrimary} mb-2 leading-tight`}
              >
                {user?.fullName || t("userNamePlaceholder")}
              </h1>

              {/* Role Badge */}
              {user?.role === "patient" && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    <UserOutlined />
                    {t("patient")}
                  </span>
                </div>
              )}

              {/* Doctor Info */}
              {user?.role === "doctor" && (
                <>
                  <p className={`text-sm mt-2 ${textSecondary} font-medium`}>
                    {user.doctorInfo?.specialization ||
                      t("specializationPlaceholder")}{" "}
                    • {user.doctorInfo?.yearsOfExperience || 0} {t("yearsExp")}
                  </p>

                  {/* Doctor Statistics - PROMINENT */}
                  <div className="flex flex-wrap gap-8 mt-6 justify-center md:justify-start">
                    {/* Rating */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <StarFilled className="text-yellow-400 text-3xl drop-shadow-lg" />
                        <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                          {(user.doctorInfo?.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className={`text-sm font-medium ${textSecondary}`}>
                        {t("rating")}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1">
                        {user.doctorInfo?.totalReviews || 0}+
                      </div>
                      <div className={`text-sm font-medium ${textSecondary}`}>
                        {t("reviews")}
                      </div>
                    </div>

                    {/* Patients */}
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1">
                        {user.doctorInfo?.totalPatients || 0}+
                      </div>
                      <div className={`text-sm font-medium ${textSecondary}`}>
                        {t("patients")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Col>

          {/* Action Buttons */}
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <div className="flex flex-col gap-3 items-center md:items-end">
              {isEditing ? (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={onSave}
                    className="w-full md:w-auto h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {t("saveChanges")}
                  </Button>
                  <Button
                    size="large"
                    onClick={onCancel}
                    className="w-full md:w-auto h-14 px-8 text-base font-semibold"
                  >
                    {t("cancel")}
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={onEdit}
                  className="w-full md:w-auto h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {t("editProfile")}
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
