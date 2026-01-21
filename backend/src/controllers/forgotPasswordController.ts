import { Request, Response } from "express";
import { OTPService } from "../services/otpService";
import { EmailService } from "../services/emailService";
import { AuthService } from "../services/authService";

const otpService = new OTPService();
const emailService = new EmailService();
const authService = new AuthService();

// 1. Request OTP for password reset
export const forgotPasswordRequest = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const otp = await otpService.createOTP(email);
    await emailService.sendOTPEmail(email, otp);
    return res.json({ message: "OTP sent to email" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Failed to send OTP" });
  }
};

// 2. Verify OTP for password reset
export const forgotPasswordVerifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  try {
    await otpService.verifyOTP(email, otp);
    return res.json({ message: "OTP verified" });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: err.message || "OTP verification failed" });
  }
};

// 3. Reset password
export const forgotPasswordReset = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email, OTP, and new password are required" });
  }
  try {
    await otpService.verifyOTP(email, otp);
    await authService.resetPassword(email, newPassword);
    return res.json({ message: "Password reset successful" });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: err.message || "Password reset failed" });
  }
};
