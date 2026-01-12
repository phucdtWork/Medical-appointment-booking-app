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
import type { UserProfile } from "@/types/profile";

/**
 * Props for ProfileHeader component
 */
type Props = {
  /** User profile data (patient or doctor) */
  user: UserProfile | null;
  /** Whether the profile is in editing mode */
  isEditing: boolean;
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
  onEdit,
  onSave,
  onCancel,
  onAvatarChange,
}: Props) {
  const t = useTranslations("profile");
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-background-dark" : "bg-white";
  const textPrimary = isDark ? "text-text-primary-dark" : "text-text-primary";
  const textSecondary = isDark
    ? "text-text-secondary-dark"
    : "text-text-secondary";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <section
      className={`${bgColor} max-w-7xl mx-auto border-b ${borderColor} py-12`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <Row gutter={[24, 24]} align="middle">
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
                  <div
                    className={`p-1 rounded-full border-2 ${isEditing ? "border-primary" : borderColor} transition-all duration-300 group-hover:border-primary`}
                  >
                    <Avatar
                      size={120}
                      src={user?.avatar}
                      icon={<UserOutlined className="text-4xl" />}
                      className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                    />
                  </div>

                  {/* Upload overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <CameraOutlined className="text-white text-2xl mb-1" />
                      <span className="text-white text-xs font-medium">
                        {t("changePhoto")}
                      </span>
                    </div>
                  )}

                  {/* Online badge */}
                  <Badge
                    status="success"
                    className="absolute bottom-2 right-2"
                    dot
                    style={{ width: 14, height: 14 }}
                  />
                </div>
              </Upload>
            </div>
          </Col>

          {/* User Info Section */}
          <Col xs={24} sm={24} md={12} lg={13} xl={14}>
            <div className="text-center md:text-left">
              {/* Name */}
              <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>
                {user?.fullName || t("userNamePlaceholder")}
              </h1>

              {/* Role Badge */}
              {user?.role === "patient" && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
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

                  {/* Doctor Statistics - Compact */}
                  <div className="flex flex-wrap gap-6 mt-4 justify-center md:justify-start">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <StarFilled className="text-yellow-500 text-xl" />
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {(user.doctorInfo?.rating || 0).toFixed(1)}
                        </span>
                        <span className={`text-xs ml-1 ${textSecondary}`}>
                          {t("rating")}
                        </span>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {user.doctorInfo?.totalReviews || 0}+
                        </span>
                        <span className={`text-xs ml-1 ${textSecondary}`}>
                          {t("reviews")}
                        </span>
                      </div>
                    </div>

                    {/* Patients */}
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {user.doctorInfo?.totalPatients || 0}+
                        </span>
                        <span className={`text-xs ml-1 ${textSecondary}`}>
                          {t("patients")}
                        </span>
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
                    className="w-full md:w-auto px-8"
                  >
                    {t("saveChanges")}
                  </Button>
                  <Button
                    size="large"
                    onClick={onCancel}
                    className="w-full md:w-auto px-8"
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
                  className="w-full md:w-auto px-8"
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
