"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, LoginData, RegisterData } from "../../lib/services";
import { authKeys } from "../queries/useAuthQuery";
import { useNotification } from "@/providers/NotificationProvider";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const notification = useNotification();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache
      queryClient.setQueryData(authKeys.me(), response.data.user);

      notification.success({
        message: "Đăng nhập thành công!",
      });

      router.push("/");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Đăng nhập thất bại";
      notification.error({
        message: "Lỗi",
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

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache
      queryClient.setQueryData(authKeys.me(), response.data.user);

      notification.success({
        message: "Đăng ký thành công!",
      });
      router.push("/");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Đăng ký thất bại";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    },
  });
};

export const useRequestOtp = () => {
  const notification = useNotification();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (email: string) => authService.requestOtp(email),
    onSuccess: () => {
      router.push("/verify-otp");
      notification.success({ message: "OTP đã được gửi đến email của bạn" });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Yêu cầu OTP thất bại";
      notification.error({
        message: "Lỗi",
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
      notification.success({ message: "Đăng ký thành công!" });
      router.push("/");
    },
    onError: (error: any) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.error || "Xác minh hoặc đăng ký thất bại";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    },
  });
};

export const useResendOtp = () => {
  const notification = useNotification();
  const mutation = useMutation({
    mutationFn: (email: string) => authService.resendOtp(email),
    onSuccess: () => {
      notification.success({
        message: "OTP đã được gửi lại đến email của bạn",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Gửi lại OTP thất bại";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    },
  });
  return mutation;
};
