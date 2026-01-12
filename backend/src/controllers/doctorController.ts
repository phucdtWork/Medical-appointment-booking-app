import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctorService";
import { message } from "antd";

const doctorService = new DoctorService();

export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const start = Date.now();
    const { specialization, minRating, limit, page } = req.query;

    const parsedMinRating = minRating
      ? parseFloat(minRating as string)
      : undefined;
    const parsedLimit = limit
      ? Math.min(100, parseInt(limit as string, 10) || 30)
      : 30;
    const parsedPage = page
      ? Math.max(1, parseInt(page as string, 10) || 1)
      : 1;

    const result = await doctorService.getDoctors({
      specialization: specialization as string,
      minRating: parsedMinRating,
      limit: parsedLimit,
      page: parsedPage,
    });

    const duration = Date.now() - start;
    console.log(
      `doctorController.getDoctors: returned ${result.data.length} doctors in ${duration}ms`
    );

    // ETag / Last-Modified support
    const clientEtag = req.headers["if-none-match"] as string | undefined;
    const clientModifiedSince = req.headers["if-modified-since"] as
      | string
      | undefined;

    if (clientEtag && clientEtag === result.etag) {
      return res.status(304).end();
    }

    if (clientModifiedSince) {
      try {
        const since = new Date(clientModifiedSince).getTime();
        const last = new Date(result.lastModified).getTime();
        if (!isNaN(since) && last <= since) {
          return res.status(304).end();
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    res.setHeader("ETag", result.etag);
    res.setHeader("Last-Modified", result.lastModified);
    res.setHeader(
      "Cache-Control",
      `public, max-age=${parseInt(process.env.DOCTORS_CACHE_TTL || "30", 10)}`
    );

    res.json({
      success: true,
      count: result.data.length,
      data: result.data,
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
      message: "Only doctor with id",
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
