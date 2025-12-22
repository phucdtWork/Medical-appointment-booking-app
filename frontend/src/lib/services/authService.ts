import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string;
      role: "patient" | "doctor";
      avatar?: string;
    };
  };
}

export const authService = {
  requestOtp: async (email: string): Promise<{ success: boolean }> => {
    const response = await api.post("/auth/register/request-otp", { email });
    return response.data;
  },

  verifyAndRegister: async (data: {
    email: string;
    otp: string;
    password: string;
    fullName: string;
    phone: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register/verify-otp", data);
    return response.data;
  },

  resendOtp: async (email: string): Promise<{ success: boolean }> => {
    const response = await api.post("/auth/register/resend-otp", { email });
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// React Query hooks
export const useMe = () => {
  return useQuery(["me"], () => authService.getMe(), {
    enabled: !!localStorage.getItem("token"),
  });
};

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: { email: string; password: string }) => authService.login(data),
    {
      onSuccess: (res: any) => {
        const token = res.data.token;
        const user = res.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        qc.invalidateQueries(["me"]);
      },
    }
  );
};
