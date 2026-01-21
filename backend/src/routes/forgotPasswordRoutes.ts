import { Router } from "express";
import {
  forgotPasswordRequest,
  forgotPasswordVerifyOtp,
  forgotPasswordReset,
} from "../controllers/forgotPasswordController";

const router = Router();

// Request OTP for password reset
router.post("/request-otp", forgotPasswordRequest);
// Verify OTP for password reset
router.post("/verify-otp", forgotPasswordVerifyOtp);
// Reset password
router.post("/reset", forgotPasswordReset);

export default router;
