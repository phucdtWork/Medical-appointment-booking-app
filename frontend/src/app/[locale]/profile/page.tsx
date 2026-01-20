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
    loading,
    avatarPreview,
  } = useProfileForm(user);

  if (!isAuthenticated) {
    return <ProfilePageSkeleton />;
  }

  const pageBg = isDark ? "bg-background-dark" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 py-8">
          {/* Profile Header - Left Side (Fixed on Desktop, Normal on Mobile) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
              <ProfileHeader
                user={user}
                isEditing={isEditing}
                isLoading={loading}
                avatarPreview={avatarPreview}
                onEdit={() => setIsEditing((s) => !s)}
                onSave={() => handleSave()}
                onCancel={() => {
                  resetToUser();
                  setIsEditing(false);
                }}
                onAvatarChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* General Information - Combined Personal + Contact */}
              <GeneralInfoCard
                form={form}
                isEditing={isEditing}
                isLoading={loading}
              />

              {/* Medical Information - For Patients */}
              {user?.role === "patient" && (
                <MedicalInfoCard
                  form={form}
                  isEditing={isEditing}
                  isLoading={loading}
                />
              )}

              {user?.role === "doctor" && (
                <>
                  <ProfessionalProfileCard
                    form={form}
                    isEditing={isEditing}
                    isLoading={loading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
