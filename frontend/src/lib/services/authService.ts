import api from "../api/axios";

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
