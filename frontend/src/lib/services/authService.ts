import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotification } from "@/providers/NotificationProvider";

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

  // Google Login - send Firebase ID token to backend
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/google", { idToken });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get("/auth/me");
    const data = response.data;

    // Parse doctorInfo if it's a string
    if (data.data?.doctorInfo && typeof data.data.doctorInfo === "string") {
      try {
        data.data.doctorInfo = JSON.parse(data.data.doctorInfo);
      } catch (e) {
        console.error("Failed to parse doctorInfo:", e);
      }
    }

    return data;
  },

  // Update user profile (for both patient and doctor)
  updateProfile: async (formData: FormData) => {
    const response = await api.put("/auth/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;

    // Parse doctorInfo if it's a string
    if (data.data?.doctorInfo && typeof data.data.doctorInfo === "string") {
      try {
        data.data.doctorInfo = JSON.parse(data.data.doctorInfo);
      } catch (e) {
        console.error("Failed to parse doctorInfo:", e);
      }
    }

    return data;
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// React Query hooks
export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    enabled: !!localStorage.getItem("token"),
  });
};

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authService.login(data),
    onSuccess: (res: { data: { token: string; user: unknown } }) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch custom event for same-tab listeners
      window.dispatchEvent(new Event("auth:token-set"));

      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useGoogleLogin = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const notification = useNotification();
  // @ts-expect-error - useTranslations can only be used in client components
  const t = useTranslations?.("auth") || null;

  return useMutation({
    mutationFn: (idToken: string) => authService.googleLogin(idToken),
    onSuccess: (res: { data: { token: string; user: unknown } }) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch custom event for same-tab listeners
      window.dispatchEvent(new Event("auth:token-set"));

      qc.invalidateQueries({ queryKey: ["me"] });

      notification.success({
        message:
          t?.("notifications.googleLoginSuccess") ?? "Google login successful!",
      });
      router.push("/");
    },
    onError: (
      error:
        | { response?: { data?: { error?: string } }; message?: string }
        | unknown,
    ) => {
      console.error("Google login failed:", error);
      let errorMsg: string | undefined;
      if (
        error instanceof Object &&
        "response" in error &&
        typeof (error as Record<string, unknown>).response === "object" &&
        (error as Record<string, unknown>).response !== null &&
        "data" in ((error as Record<string, unknown>).response as object)
      ) {
        const data = (
          (error as Record<string, unknown>).response as Record<string, unknown>
        )?.data as Record<string, unknown> | undefined;
        errorMsg = (data?.error as string) || undefined;
      }
      const msg =
        errorMsg ||
        (error instanceof Error ? error.message : undefined) ||
        (t?.("notifications.googleLoginFailure") ?? "Google login failed");
      notification.error({
        message: t?.("notifications.error") ?? "Error",
        description: msg,
      });
    },
  });
};
