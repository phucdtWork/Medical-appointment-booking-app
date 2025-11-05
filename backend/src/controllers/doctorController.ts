import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctorService";

const doctorService = new DoctorService();

export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { specialization, minRating } = req.query;

    const doctors = await doctorService.getDoctors({
      specialization: specialization as string,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
    });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    next(error);
  }
};

export const addManyDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorsData = req.body;
    const addedDoctors = await doctorService.addManyDoctors(doctorsData);
    res.status(201).json({
      success: true,
      count: addedDoctors.length,
      data: addedDoctors,
    });
  } catch (error: any) {
    next(error);
  }
};
