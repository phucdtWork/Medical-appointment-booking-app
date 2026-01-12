import { Router } from "express";
import {
  login,
  getMe,
  editProfile,
  requestOtp,
  verifyAndRegister,
  resendOtp,
  googleAuth,
  registerDoctor,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { uploadAvatar } from "../config/multer";

const router = Router();

// New OTP-based registration flow
router.post("/register/request-otp", requestOtp);
router.post("/register/verify-otp", verifyAndRegister);
router.post("/register/resend-otp", resendOtp);

// Doctor registration
router.post("/register/doctor", registerDoctor);

router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", authenticate, getMe);

// Update profile for both patient and doctor with avatar upload
router.put("/me", authenticate, uploadAvatar.single("avatar"), editProfile);

export default router;
