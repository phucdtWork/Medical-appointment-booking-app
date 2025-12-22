import express from "express";
import { ScheduleController } from "../controllers/scheduleController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", authenticate, ScheduleController.upsertSchedule);
router.get("/doctor/:doctorId", ScheduleController.getSchedule);
router.get("/doctor/:doctorId/slots", ScheduleController.getAvailableSlots);
router.get(
  "/doctor/:doctorId/slots/range",
  ScheduleController.getAvailableSlotsRange
);

export default router;
