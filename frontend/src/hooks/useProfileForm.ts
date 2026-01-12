"use client";

import { useState, useEffect } from "react";
import { Form, message } from "antd";
import dayjs from "dayjs";
import type { User } from "@/types/appointment";

export const useProfileForm = (user?: any) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // convert date fields to Dayjs for DatePicker compatibility
      const values: any = { ...user };
      if (user.dateOfBirth) {
        try {
          values.dateOfBirth = dayjs(user.dateOfBirth);
        } catch (e) {
          values.dateOfBirth = user.dateOfBirth;
        }
      }
      form.setFieldsValue(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resetToUser = () => {
    form.resetFields();
    if (user) {
      const values: any = { ...user };
      if (user.dateOfBirth) {
        try {
          values.dateOfBirth = dayjs(user.dateOfBirth);
        } catch (e) {
          values.dateOfBirth = user.dateOfBirth;
        }
      }
      form.setFieldsValue(values);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Call API to update profile (placeholder endpoint)
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      message.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      message.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    // simple preview using FileReader; actual upload should call API
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
    loading,
    handleSave,
    handleAvatarChange,
    resetToUser,
  } as const;
};
