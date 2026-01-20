"use client";

import { useState, useEffect } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { useUpdateProfile } from "./mutations/useAuthMutation";
import { useAuth } from "./queries/useAuthQuery";

export const useProfileForm = (user?: Record<string, unknown>) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { refetch } = useAuth();

  useEffect(() => {
    if (user) {
      // convert date fields to Dayjs for DatePicker compatibility
      const values: Record<string, unknown> = { ...user };
      if (user.dateOfBirth) {
        try {
          const dateValue = user.dateOfBirth;
          values.dateOfBirth =
            typeof dateValue === "string" || typeof dateValue === "number"
              ? dayjs(dateValue)
              : dayjs();
        } catch {
          values.dateOfBirth = dayjs();
        }
      }
      // Ensure medicalHistory and allergies are arrays
      if (values.medicalHistory && !Array.isArray(values.medicalHistory)) {
        values.medicalHistory = [];
      }
      if (values.allergies && !Array.isArray(values.allergies)) {
        values.allergies = [];
      }
      form.setFieldsValue(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resetToUser = () => {
    form.resetFields();
    setAvatarFile(null);
    if (user) {
      const values: Record<string, unknown> = { ...user };
      if (user.dateOfBirth) {
        try {
          const dateValue = user.dateOfBirth;
          values.dateOfBirth =
            typeof dateValue === "string" || typeof dateValue === "number"
              ? dayjs(dateValue)
              : dayjs();
        } catch {
          values.dateOfBirth = dayjs();
        }
      }
      // Ensure medicalHistory and allergies are arrays
      if (values.medicalHistory && !Array.isArray(values.medicalHistory)) {
        values.medicalHistory = [];
      }
      if (values.allergies && !Array.isArray(values.allergies)) {
        values.allergies = [];
      }
      form.setFieldsValue(values);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for multipart request
      const formData = new FormData();

      // Add all form fields
      Object.keys(values).forEach((key) => {
        const value = values[key];

        // Skip avatar field from form data
        if (key === "avatar") return;

        // Handle date fields
        if (key === "dateOfBirth" && value) {
          formData.append(key, value.toISOString());
          return;
        }

        // Handle doctor info (if exists)
        if (key === "doctorInfo" && value) {
          formData.append(key, JSON.stringify(value));
          return;
        }

        // Handle other fields
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      // Add avatar file if exists
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Call mutation
      updateProfile(formData, {
        onSuccess: () => {
          setIsEditing(false);
          setAvatarFile(null);
          refetch();
        },
      });
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;

    // Store file for upload
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      form.setFieldsValue({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return {
    form,
    isEditing,
    setIsEditing,
    loading: isPending,
    handleSave,
    handleAvatarChange,
    resetToUser,
  } as const;
};
