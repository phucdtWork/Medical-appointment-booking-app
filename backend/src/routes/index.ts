import { Router } from "express";
import authRoutes from "./authRoutes";

import doctorRoutes from "./doctorRoutes";
import appointmentRoutes from "./appointmentRoutes";
import scheduleRoutes from "./scheduleRoutes";
import reviewRoutes from "./reviewRoutes";
import medicalDataRoutes from "./medicalDataRoutes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/doctors", doctorRoutes);
router.use("/api/appointments", appointmentRoutes);
router.use("/api/schedules", scheduleRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/medical-data", medicalDataRoutes);

export default router;
