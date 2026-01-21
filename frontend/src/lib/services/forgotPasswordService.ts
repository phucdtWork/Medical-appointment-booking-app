import { authService } from "@/lib/services";

export const forgotPassword = {
  requestOtp: (email: string) => authService.forgotPasswordRequestOtp(email),
  verifyOtp: (email: string, otp: string) =>
    authService.forgotPasswordVerifyOtp(email, otp),
  reset: (email: string, otp: string, newPassword: string) =>
    authService.forgotPasswordReset(email, otp, newPassword),
};
