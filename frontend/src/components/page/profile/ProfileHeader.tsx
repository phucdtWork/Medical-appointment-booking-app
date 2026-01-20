import React, { useState } from "react";
import { Avatar, Button, Upload, Badge } from "antd";
import Image from "next/image";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  StarFilled,
  MedicineBoxOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import type { UserProfile } from "@/types/profile";

/**
 * Props for ProfileHeader component
 */
type Props = {
  /** User profile data (patient or doctor) */
  user: UserProfile | null;
  /** Whether the profile is in editing mode */
  isEditing: boolean;
  /** Whether update is loading */
  isLoading?: boolean;
  /** Avatar preview (local) - shows immediately after upload */
  avatarPreview?: string | null;
  /** Callback when edit button is clicked */
  onEdit: () => void;
  /** Callback when save button is clicked */
  onSave: () => void;
  /** Callback when cancel button is clicked */
  onCancel: () => void;
  /** Callback when avatar file is selected/changed */
  onAvatarChange: (file: File) => void | Promise<void>;
};

export default function ProfileHeader({
  user,
  isEditing,
  isLoading = false,
  avatarPreview,
  onEdit,
  onSave,
  onCancel,
  onAvatarChange,
}: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);

  const bgColor = isDark ? "bg-[#001529]" : "bg-white";
  const cardBg = isDark
    ? "bg-gray-800/50"
    : "bg-linear-to-br from-blue-50 to-indigo-50";
  const textPrimary = isDark ? "text-text-primary-dark" : "text-gray-900";
  const textSecondary = isDark ? "text-text-secondary-dark" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-100";
  const statBg = isDark ? "bg-gray-700/50" : "bg-white";

  return (
    <section
      className={`${bgColor} rounded-2xl shadow-lg overflow-hidden border ${borderColor}`}
    >
      {/* Header Background Pattern */}
      <div className={`${cardBg} h-32 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      <div className="px-6 pb-6 -mt-16 relative">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
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
              <Badge
                count={
                  isEditing ? <CameraOutlined className="text-white" /> : 0
                }
                style={{
                  backgroundColor: "#1890ff",
                  boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                }}
              >
                <div
                  className={`p-1.5 rounded-full ${bgColor} shadow-xl border-4 ${
                    isEditing
                      ? "border-blue-400"
                      : "border-white dark:border-gray-700"
                  } transition-all duration-300 group-hover:border-blue-400`}
                >
                  {(avatarPreview || user?.avatar) && !imageError ? (
                    <Image
                      src={avatarPreview || user?.avatar || ""}
                      alt={user?.fullName || "User avatar"}
                      width={140}
                      height={140}
                      className="w-[140px] h-[140px] rounded-full object-cover"
                      priority
                      unoptimized
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Avatar
                      size={140}
                      icon={<UserOutlined className="text-5xl" />}
                      className={`${isDark ? "bg-gray-700" : "bg-linear-to-br from-blue-100 to-indigo-100"}`}
                    />
                  )}
                </div>
              </Badge>

              {/* Upload overlay */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <CameraOutlined className="text-white text-3xl mb-2" />
                  <span className="text-white text-sm font-medium">
                    {t("changePhoto")}
                  </span>
                </div>
              )}
            </div>
          </Upload>

          {/* User Info */}
          <div className="text-center mt-4 space-y-2">
            <h1 className={`text-2xl font-bold ${textPrimary}`}>
              {user?.fullName || t("userNamePlaceholder")}
            </h1>

            <p
              className={`text-sm ${textSecondary} flex items-center justify-center gap-1`}
            >
              <span className="opacity-60">
                @{user?.email?.split("@")[0] || "user"}
              </span>
            </p>

            {/* Doctor Specialization Badge */}
            {user?.role === "doctor" && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <MedicineBoxOutlined
                  style={{ fontSize: "1rem", color: "#1890ff" }}
                />
                <span className="text-sm font-medium">
                  {user.doctorInfo?.specialization ||
                    t("specializationPlaceholder")}
                </span>
                <span className="text-xs opacity-75">
                  • {user.doctorInfo?.yearsOfExperience || 0} {t("yearsExp")}
                </span>
              </div>
            )}
          </div>

          {/* Doctor Statistics */}
          {user?.role === "doctor" && (
            <div className="w-full mt-6 space-y-3">
              {/* Rating Star */}
              <div
                className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <StarFilled
                        className="text-2xl"
                        style={{ color: "orange" }}
                      />
                    </div>
                    <div>
                      <p className={`text-xs ${textSecondary} mb-1`}>
                        {t("rating")}
                      </p>
                      <p className="text-2xl font-bold text-orange-500">
                        {(user.doctorInfo?.rating || 0).toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarFilled
                        key={star}
                        style={{
                          fontSize: "1rem",
                          color:
                            star <= Math.round(user.doctorInfo?.rating || 0)
                              ? "#facc15"
                              : isDark
                                ? "#4b5563"
                                : "#d1d5db",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews & Patients */}
              <div className="grid grid-cols-2 gap-3">
                {/* Reviews */}
                <div
                  className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                      <TrophyOutlined
                        style={{ fontSize: "1.25rem", color: "#3b82f6" }}
                      />
                    </div>
                    <p className="text-2xl font-bold text-blue-500">
                      {user.doctorInfo?.totalReviews || 0}+
                    </p>
                    <p className={`text-xs ${textSecondary} mt-1`}>
                      {t("reviews")}
                    </p>
                  </div>
                </div>

                {/* Patients */}
                <div
                  className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                      <TeamOutlined
                        style={{ fontSize: "1.25rem", color: "#22c55e" }}
                      />
                    </div>
                    <p className="text-2xl font-bold text-green-500">
                      {user.doctorInfo?.totalPatients || 0}+
                    </p>
                    <p className={`text-xs ${textSecondary} mt-1`}>
                      {t("patients")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full mt-6 space-y-2">
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={onSave}
                  loading={isLoading}
                  disabled={isLoading}
                  size="large"
                  className="w-full font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  {t("saveChanges")}
                </Button>
                <Button
                  size="large"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full font-medium"
                >
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={onEdit}
                size="large"
                className="w-full font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {t("editProfile")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
