import { Request, Response } from "express";
import { db } from "../config/firebase";
import {
  DoctorSchedule,
  DOCTOR_SCHEDULES_COLLECTION,
} from "../models/DoctorSchedule";
import { SlotGeneratorService } from "../services/slotGeneratorService";
import { format, addDays } from "date-fns";

export class ScheduleController {
  /**
   * Create or update doctor schedule
   */
  static async upsertSchedule(req: Request, res: Response) {
    try {
      const doctorId = req.user?.userId;
      const scheduleData: Partial<DoctorSchedule> = req.body;

      // Validate doctor role
      if (req.user?.role !== "doctor") {
        return res
          .status(403)
          .json({ message: "Only doctors can manage schedules" });
      }

      const scheduleRef = db.collection(DOCTOR_SCHEDULES_COLLECTION);
      const existingSchedule = await scheduleRef
        .where("doctorId", "==", doctorId)
        .limit(1)
        .get();

      const now = new Date();

      if (existingSchedule.empty) {
        // Create new schedule
        const newSchedule: DoctorSchedule = {
          ...(scheduleData as DoctorSchedule),
          doctorId: doctorId!,
          createdAt: now,
          updatedAt: now,
        };

        const docRef = await scheduleRef.add(newSchedule);

        return res.status(201).json({
          id: docRef.id,
          ...newSchedule,
        });
      } else {
        // Update existing schedule
        const docId = existingSchedule.docs[0].id;
        await scheduleRef.doc(docId).update({
          ...scheduleData,
          updatedAt: now,
        });

        const updated = await scheduleRef.doc(docId).get();

        return res.json({
          id: docId,
          ...updated.data(),
        });
      }
    } catch (error) {
      console.error("Error upserting schedule:", error);
      res.status(500).json({ message: "Failed to save schedule" });
    }
  }

  /**
   * Get doctor's schedule
   */
  static async getSchedule(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;

      const scheduleRef = db.collection(DOCTOR_SCHEDULES_COLLECTION);
      const snapshot = await scheduleRef
        .where("doctorId", "==", doctorId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      const doc = snapshot.docs[0];
      return res.json({
        id: doc.id,
        ...doc.data(),
      });
    } catch (error) {
      console.error("Error getting schedule:", error);
      res.status(500).json({ message: "Failed to get schedule" });
    }
  }

  /**
   * Get available slots for a doctor on specific date
   */
  static async getAvailableSlots(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query; // "2025-12-15"

      if (!date || typeof date !== "string") {
        return res.status(400).json({ message: "Date is required" });
      }

      // Get doctor's schedule
      const scheduleSnapshot = await db
        .collection(DOCTOR_SCHEDULES_COLLECTION)
        .where("doctorId", "==", doctorId)
        .limit(1)
        .get();

      if (scheduleSnapshot.empty) {
        return res.status(404).json({ message: "Doctor schedule not found" });
      }

      const schedule = {
        id: scheduleSnapshot.docs[0].id,
        ...scheduleSnapshot.docs[0].data(),
      } as DoctorSchedule;

      // Get existing appointments for this date
      const appointmentsSnapshot = await db
        .collection("appointments")
        .where("doctorId", "==", doctorId)
        .where("date", "==", date)
        .get();

      const appointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Generate available slots
      const slots = await SlotGeneratorService.generateSlotsForDate(
        doctorId,
        date,
        schedule,
        appointments
      );

      return res.json({ slots });
    } catch (error) {
      console.error("Error getting available slots:", error);
      res.status(500).json({ message: "Failed to get available slots" });
    }
  }

  /**
   * Get available slots for multiple days (for calendar view)
   */
  static async getAvailableSlotsRange(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const startDateRaw = (req.query.startDate ??
        req.query.start ??
        req.query.date) as string | undefined;
      const daysRaw = req.query.days ?? 7;

      if (!startDateRaw || typeof startDateRaw !== "string") {
        return res.status(400).json({ message: "Start date is required" });
      }

      const schedule = await ScheduleController.getDoctorSchedule(doctorId);
      if (!schedule) {
        return res.status(404).json({ message: "Doctor schedule not found" });
      }

      const result: { [date: string]: any[] } = {};
      const start = new Date(startDateRaw);
      const days = Number(daysRaw);

      for (let i = 0; i < days; i++) {
        const currentDate = addDays(start, i);
        const dateStr = format(currentDate, "yyyy-MM-dd");

        const appointments = await ScheduleController.getAppointmentsForDate(
          doctorId,
          dateStr
        );
        const slots = await SlotGeneratorService.generateSlotsForDate(
          doctorId,
          dateStr,
          schedule,
          appointments
        );

        result[dateStr] = slots;
      }

      return res.json(result);
    } catch (error) {
      console.error("Error getting slots range:", error);
      res.status(500).json({ message: "Failed to get slots range" });
    }
  }

  /**
   * Helper: Get doctor schedule
   */
  private static async getDoctorSchedule(
    doctorId: string
  ): Promise<DoctorSchedule | null> {
    const snapshot = await db
      .collection(DOCTOR_SCHEDULES_COLLECTION)
      .where("doctorId", "==", doctorId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as DoctorSchedule;
  }

  /**
   * Helper: Get appointments for a date
   */
  private static async getAppointmentsForDate(doctorId: string, date: string) {
    const snapshot = await db
      .collection("appointments")
      .where("doctorId", "==", doctorId)
      .where("date", "==", date)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
  }
}
