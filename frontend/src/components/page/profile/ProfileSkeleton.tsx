/**
 * Skeleton loaders matching profile page layout
 */

import React from "react";
import { Card, Skeleton } from "antd";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * ProfileHeader Skeleton
 */
export function ProfileHeaderSkeleton() {
  const { isDark } = useTheme();
  const bgColor = isDark ? "bg-[#001529]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-100";
  const cardBg = isDark
    ? "bg-gray-800/50"
    : "bg-gradient-to-br from-blue-50 to-indigo-50";
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
        {/* Avatar & User Info */}
        <div className="flex flex-col items-center">
          {/* Avatar Skeleton */}
          <div className="flex justify-center mb-4">
            <Skeleton.Avatar active size={140} shape="circle" />
          </div>

          {/* User Name & Email */}
          <div className="text-center space-y-2 w-full max-w-xs">
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          </div>

          {/* Badge Skeleton */}
          <div className="mt-4 w-full max-w-xs">
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          </div>

          {/* Stats Skeleton */}
          <div className="w-full mt-6 space-y-3">
            {/* Rating Box */}
            <div
              className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
            >
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            </div>

            {/* Reviews & Patients Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
              >
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </div>
              <div
                className={`${statBg} rounded-xl p-4 shadow-sm border ${borderColor}`}
              >
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="w-full mt-6 space-y-2">
            <Skeleton.Button active block size="large" />
            <Skeleton.Button active block size="large" />
          </div>
        </div>
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 py-8">
          {/* Profile Header - Left Side */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
              <ProfileHeaderSkeleton />
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-3">
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
      </div>
    </div>
  );
}
