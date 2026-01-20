"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginData } from "../../lib/services";
import { authKeys } from "../queries/useAuthQuery";
import { useNotification } from "@/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache immediately
      queryClient.setQueryData(authKeys.me(), response.data.user);
      // Invalidate other queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      notification.success({
        message: t("notifications.loginSuccess"),
      });

      // Don't redirect here - let the component handle it based on role
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage = error.response?.data?.error || t("notifications.loginFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notification = useNotification();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      password: string;
      fullName: string;
      phone: string;
    }) => authService.verifyAndRegister(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache immediately
      queryClient.setQueryData(authKeys.me(), response.data.user);
      // Invalidate other queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      notification.success({
        message: t("notifications.registerSuccess"),
      });
      router.push("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || t("notifications.registerFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
};

export const useRequestOtp = () => {
  const notification = useNotification();
  const router = useRouter();
  const t = useTranslations("auth");
  const mutation = useMutation({
    mutationFn: (email: string) => authService.requestOtp(email),
    onSuccess: () => {
      router.push("/verify-otp");
      notification.success({ message: t("notifications.requestOtpSuccess") });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error.response?.data?.error || t("notifications.requestOtpFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
  return mutation;
};

export const useVerifyAndRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notification = useNotification();
  const t = useTranslations("auth");
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      password: string;
      fullName: string;
      phone: string;
    }) => authService.verifyAndRegister(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Update cache
      queryClient.setQueryData(authKeys.me(), response.data.user);
      notification.success({ message: t("notifications.registerSuccess") });
      router.push("/");
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error.response?.data?.error || t("notifications.verifyOtpFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
};

export const useResendOtp = () => {
  const notification = useNotification();
  const t = useTranslations("auth");
  const mutation = useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
    onSuccess: () => {
      notification.success({
        message: t("notifications.requestOtpSuccess"),
      });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error.response?.data?.error || t("notifications.resendOtpFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
  return mutation;
};

// Update profile mutation (for both patient and doctor)
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: (formData: FormData) => authService.updateProfile(formData),
    onSuccess: (response) => {
      // Update cache with new user data
      queryClient.setQueryData(authKeys.me(), response.data);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      notification.success({
        message: t("notifications.updateProfileSuccess"),
      });
    },
    onError: (error: {
      response?: { data?: { message?: string; error?: string } };
    }) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        t("notifications.updateProfileFailure");
      notification.error({
        message: t("notifications.error"),
        description: errorMessage,
      });
    },
  });
};
