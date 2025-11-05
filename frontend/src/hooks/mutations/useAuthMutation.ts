"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { authService, LoginData, RegisterData } from "../../lib/services";
import { authKeys } from "../queries/useAuthQuery";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache
      queryClient.setQueryData(authKeys.me(), response.data.user);

      message.success("Đăng nhập thành công!");

      // Redirect based on role
      if (response.data.user.role === "doctor") {
        router.push("/doctor-dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Đăng nhập thất bại";
      message.error(errorMessage);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update cache
      queryClient.setQueryData(authKeys.me(), response.data.user);

      message.success("Đăng ký thành công!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Đăng ký thất bại";
      message.error(errorMessage);
    },
  });
};
