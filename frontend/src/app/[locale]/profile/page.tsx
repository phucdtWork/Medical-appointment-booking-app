"use client";

import React from "react";
import { Row, Col, Card, Skeleton } from "antd";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/hooks";

import ProfileHeader from "@/components/page/profile/ProfileHeader";
import ProfileSidebar from "@/components/page/profile/ProfileSidebar";
import PersonalInfoCard from "@/components/page/profile/PersonalInfoCard";
import ContactInfoCard from "@/components/page/profile/ContactInfoCard";
import MedicalInfoCard from "@/components/page/profile/MedicalInfoCard";
import ProfessionalInfoCard from "@/components/page/profile/ProfessionalInfoCard";
import EducationBioCard from "@/components/page/profile/EducationBioCard";
import StatisticsCard from "@/components/page/profile/StatisticsCard";
import { useProfileForm } from "@/hooks/useProfileForm";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const {
    form,
    isEditing,
    setIsEditing,
    handleSave,
    handleAvatarChange,
    resetToUser,
  } = useProfileForm(user);

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <Card className="shadow-md">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  const bg = isDark
    ? "bg-background-dark"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  return (
    <div className="min-h-screen">
      <div className={`${bg} max-w-7xl mx-auto py-12 px-4`}>
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          onEdit={() => setIsEditing((s) => !s)}
          onSave={() => handleSave()}
          onCancel={() => {
            resetToUser();
            setIsEditing(false);
          }}
          onAvatarChange={handleAvatarChange}
        />
      </div>

      <div className=" max-w-7xl mx-auto py-8 px-4">
        <Row gutter={24}>
          <Col xs={24} lg={24}>
            <div>
              <PersonalInfoCard form={form} isEditing={isEditing} />
              <ContactInfoCard form={form} isEditing={isEditing} />

              {user?.role === "patient" && (
                <MedicalInfoCard form={form} isEditing={isEditing} />
              )}

              {user?.role === "doctor" && (
                <>
                  <ProfessionalInfoCard form={form} isEditing={isEditing} />
                  <EducationBioCard form={form} isEditing={isEditing} />
                  <StatisticsCard user={user} />
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
