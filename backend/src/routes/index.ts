import { Router } from "express";
import authRoutes from "./authRoutes";
import doctorRoutes from "./doctorRoutes";
import appointmentRoutes from "./appointmentRoutes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/doctors", doctorRoutes);
router.use("/api/appointments", appointmentRoutes);

export default router;
