import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/services/forgotPasswordService";
import { useNotification } from "@/providers/NotificationProvider";
import { useTranslations } from "next-intl";

export const useForgotPasswordRequestOtp = () => {
  const notification = useNotification();
  const t = useTranslations("auth");
  return useMutation({
    mutationFn: (email: string) => forgotPassword.requestOtp(email),
    onSuccess: () => {
      notification.success({ message: t("notifications.requestOtpSuccess") });
    },
    onError: (error: any) => {
      notification.error({
        message: t("notifications.error"),
        description:
          error?.response?.data?.error || t("notifications.requestOtpFailure"),
      });
    },
  });
};

export const useForgotPasswordVerifyOtp = () => {
  const notification = useNotification();
  const t = useTranslations("auth");
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      forgotPassword.verifyOtp(email, otp),
    onSuccess: () => {
      notification.success({ message: t("notifications.verifyOtpSuccess") });
    },
    onError: (error: any) => {
      notification.error({
        message: t("notifications.error"),
        description:
          error?.response?.data?.error || t("notifications.verifyOtpFailure"),
      });
    },
  });
};

export const useForgotPasswordReset = () => {
  const notification = useNotification();
  const t = useTranslations("auth");
  return useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => forgotPassword.reset(email, otp, newPassword),
    onSuccess: () => {
      notification.success({
        message: t("notifications.resetPasswordSuccess"),
      });
    },
    onError: (error: any) => {
      notification.error({
        message: t("notifications.error"),
        description:
          error?.response?.data?.error ||
          t("notifications.resetPasswordFailure"),
      });
    },
  });
};
