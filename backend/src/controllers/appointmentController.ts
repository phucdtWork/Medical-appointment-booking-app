import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointmentService";
import eventBus from "../utils/eventBus";

const appointmentService = new AppointmentService();

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentData = {
      ...req.body,
      patientId: req.user!.userId,
    };

    const appointment =
      await appointmentService.createAppointment(appointmentData);

    // Emit realtime event for listeners (non-blocking)
    try {
      eventBus.emit("appointment", { action: "created", appointment });
    } catch (err) {
      // ignore emit errors
    }

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateMyAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;
    const { action, date, timeSlot } = req.body;

    const existing = await appointmentService.getAppointmentById(appointmentId);

    // only owner can update
    if (existing.patientId !== req.user!.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (action === "cancel") {
      if (existing.status === "completed") {
        return res
          .status(400)
          .json({
            success: false,
            message: "Cannot cancel a completed appointment",
          });
      }

      const updated = await appointmentService.cancelAppointment(appointmentId);

      try {
        eventBus.emit("appointment", {
          action: "updated",
          appointment: updated,
        });
      } catch (err) {
        // ignore
      }

      return res.json({ success: true, data: updated });
    }

    if (action === "reschedule") {
      if (!date || !timeSlot) {
        return res
          .status(400)
          .json({ success: false, message: "Missing date or timeSlot" });
      }

      const updated = await appointmentService.rescheduleAppointment(
        appointmentId,
        date,
        timeSlot
      );

      try {
        eventBus.emit("appointment", {
          action: "updated",
          appointment: updated,
        });
      } catch (err) {
        // ignore
      }

      return res.json({ success: true, data: updated });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error: any) {
    next(error);
  }
};

export const getMyAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await appointmentService.getAppointmentsByPatient(
      req.user!.userId
    );

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getDoctorAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;

    const appointments = await appointmentService.getAppointmentsByDoctor(
      req.user!.userId,
      status as string
    );

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, doctorNotes, rejectionReason } = req.body;

    const appointment = await appointmentService.updateAppointmentStatus(
      req.params.id,
      status,
      doctorNotes,
      rejectionReason
    );

    try {
      eventBus.emit("appointment", { action: "updated", appointment });
    } catch (err) {
      // ignore
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    next(error);
  }
};
