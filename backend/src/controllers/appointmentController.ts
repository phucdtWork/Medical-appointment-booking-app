import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointmentService";

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

    const appointment = await appointmentService.createAppointment(
      appointmentData
    );

    res.status(201).json({
      success: true,
      data: appointment,
    });
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

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    next(error);
  }
};
