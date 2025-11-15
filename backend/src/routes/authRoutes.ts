import { Router } from "express";
import {
  register,
  login,
  getMe,
  editProfile,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { uploadAvatar } from "../config/multer";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, uploadAvatar.single("avatar"), editProfile);

export default router;
