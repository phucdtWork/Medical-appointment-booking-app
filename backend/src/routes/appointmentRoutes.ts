import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// Patient routes
router.post("/", authenticate, requireRole(["patient"]), createAppointment);
router.get("/my", authenticate, requireRole(["patient"]), getMyAppointments);

// Doctor routes
router.get(
  "/doctor",
  authenticate,
  requireRole(["doctor"]),
  getDoctorAppointments
);
router.patch(
  "/:id/status",
  authenticate,
  requireRole(["doctor"]),
  updateAppointmentStatus
);

export default router;
