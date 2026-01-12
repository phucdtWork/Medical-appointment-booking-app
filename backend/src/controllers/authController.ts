import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { OTPService } from "../services/otpService";
import { EmailService } from "../services/emailService";

const authService = new AuthService();
const otpService = new OTPService();
const emailService = new EmailService();

// Request OTP
export const requestOtp = async (req: Request, res: Response) => {
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

// Resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const otp = await otpService.createOTP(email);
    await emailService.sendOTPEmail(email, otp);
    return res.json({ message: "OTP resent to email" });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: err.message || "Failed to resend OTP" });
  }
};

// Verify OTP and Register
export const verifyAndRegister = async (req: Request, res: Response) => {
  const { email, otp, password, fullName, phone } = req.body;

  if (!email || !otp || !password || !fullName) {
    return res
      .status(400)
      .json({ error: "email, otp, password and fullName are required" });
  }

  try {
    await otpService.verifyOTP(email, otp);

    // create user
    const { token, user } = await authService.registerPatient({
      email,
      password,
      fullName,
      phone,
    });

    // send welcome email (best-effort)
    try {
      await emailService.sendWelcomeEmail(email, fullName);
    } catch (e) {
      // ignore welcome email failures
      console.warn("Welcome email failed:", e);
    }

    return res.status(200).json({ data: { token, user } });
  } catch (err: any) {
    return res
      .status(400)
      .json({ error: err.message || "Verification or registration failed" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Google sign-in / register
export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken is required" });

    const result = await authService.googleSignIn(idToken);

    res.json({ success: true, data: result });
  } catch (error: any) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getUserById(req.user!.userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const updateData = req?.body;
    const updatedUser = await authService.editUserProfile(userId, updateData);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};
