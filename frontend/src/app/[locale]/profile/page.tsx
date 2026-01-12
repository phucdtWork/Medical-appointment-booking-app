"use client";

import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/hooks";

import ProfileHeader from "@/components/page/profile/ProfileHeader";
import GeneralInfoCard from "@/components/page/profile/GeneralInfoCard";
import MedicalInfoCard from "@/components/page/profile/MedicalInfoCard";
import ProfessionalProfileCard from "@/components/page/profile/ProfessionalProfileCard";
import { ProfilePageSkeleton } from "@/components/page/profile/ProfileSkeleton";
import { useProfileForm } from "@/hooks/useProfileForm";

export default function ProfilePage() {
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
    return <ProfilePageSkeleton />;
  }

  const pageBg = isDark ? "bg-background-dark" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      {/* Profile Header */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* General Information - Combined Personal + Contact */}
          <GeneralInfoCard form={form} isEditing={isEditing} />

          {/* Medical Information - For Patients */}
          {user?.role === "patient" && (
            <MedicalInfoCard form={form} isEditing={isEditing} />
          )}

          {user?.role === "doctor" && (
            <>
              <ProfessionalProfileCard form={form} isEditing={isEditing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
