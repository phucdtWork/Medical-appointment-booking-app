import { Router } from "express";
import {
  login,
  getMe,
  editProfile,
  requestOtp,
  verifyAndRegister,
  resendOtp,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { uploadAvatar } from "../config/multer";

const router = Router();

// New OTP-based registration flow
router.post("/register/request-otp", requestOtp);
router.post("/register/verify-otp", verifyAndRegister);
router.post("/register/resend-otp", resendOtp);

router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, uploadAvatar.single("avatar"), editProfile);

export default router;
