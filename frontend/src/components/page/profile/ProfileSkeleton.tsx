/**
 * Skeleton loaders matching profile page layout
 */

import React from "react";
import { Card, Skeleton, Row, Col } from "antd";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * ProfileHeader Skeleton
 */
export function ProfileHeaderSkeleton() {
  const { isDark } = useTheme();
  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <section
      className={`${bgColor} max-w-7xl mx-auto border-b ${borderColor} py-12`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <Row gutter={[24, 24]} align="middle">
          {/* Avatar Skeleton */}
          <Col xs={24} sm={24} md={6} lg={5} xl={4}>
            <div className="flex justify-center md:justify-start">
              <Skeleton.Avatar
                active
                size={120}
                shape="circle"
                className="w-full"
              />
            </div>
          </Col>

          {/* User Info Skeleton */}
          <Col xs={24} sm={24} md={12} lg={13} xl={14}>
            <div className="space-y-4">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            </div>
          </Col>

          {/* Action Buttons Skeleton */}
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <div className="flex flex-col gap-3">
              <Skeleton.Button active block size="large" />
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

/**
 * GeneralInfoCard Skeleton
 */
export function GeneralInfoCardSkeleton() {
  const { isDark } = useTheme();
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <Card className={`${cardBg} border ${borderColor} shadow-sm rounded-lg`}>
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton.Avatar active size={48} shape="circle" />
        <div className="flex-1">
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
      </div>
    </Card>
  );
}

/**
 * MedicalInfoCard Skeleton
 */
export function MedicalInfoCardSkeleton() {
  const { isDark } = useTheme();
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <Card className={`${cardBg} border ${borderColor} shadow-sm rounded-lg`}>
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton.Avatar active size={48} shape="circle" />
        <div className="flex-1">
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
      </div>
    </Card>
  );
}

/**
 * ProfessionalProfileCard Skeleton
 */
export function ProfessionalProfileCardSkeleton() {
  const { isDark } = useTheme();
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <Card className={`${cardBg} border ${borderColor} shadow-sm rounded-lg`}>
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton.Avatar active size={48} shape="circle" />
        <div className="flex-1">
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Professional Info Section */}
        <div>
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
          </div>
        </div>

        {/* Education Section */}
        <div>
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
          <div className="mt-4">
            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
          <div className="mt-4">
            <Skeleton active paragraph={{ rows: 3 }} title={false} />
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Profile Page Skeleton - Complete layout
 */
export function ProfilePageSkeleton() {
  const { isDark } = useTheme();
  const pageBg = isDark ? "bg-background-dark" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      {/* Profile Header Skeleton */}
      <ProfileHeaderSkeleton />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* General Info Card Skeleton */}
          <GeneralInfoCardSkeleton />

          {/* Medical Info Card Skeleton */}
          <MedicalInfoCardSkeleton />

          {/* Professional Profile Card Skeleton */}
          <ProfessionalProfileCardSkeleton />
        </div>
      </div>
    </div>
  );
}
