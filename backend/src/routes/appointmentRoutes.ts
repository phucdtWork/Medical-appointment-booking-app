import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { authenticate, requireRole } from "../middleware/auth";
import eventBus from "../utils/eventBus";

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

// SSE stream for realtime appointment updates (only authenticated users)
router.get("/stream", authenticate, (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  // flush headers if supported
  if (res.flushHeaders) res.flushHeaders();

  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const handler = (payload: any) => {
    try {
      const appointment = payload.appointment;
      if (!appointment) return;

      // send only if the appointment is relevant to this user
      if (
        (userRole === "doctor" && appointment.doctorId === userId) ||
        (userRole === "patient" && appointment.patientId === userId)
      ) {
        res.write(`event: appointment\n`);
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }
    } catch (err) {
      // ignore
    }
  };

  eventBus.on("appointment", handler);

  req.on("close", () => {
    eventBus.off("appointment", handler);
    try {
      res.end();
    } catch (e) {}
  });
});

export default router;
