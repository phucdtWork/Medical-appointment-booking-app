import { Router } from "express";
import authRoutes from "./authRoutes";
import doctorRoutes from "./doctorRoutes";
import appointmentRoutes from "./appointmentRoutes";
import scheduleRoutes from "./scheduleRoutes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/doctors", doctorRoutes);
router.use("/api/appointments", appointmentRoutes);
router.use("/api/schedules", scheduleRoutes);

export default router;
