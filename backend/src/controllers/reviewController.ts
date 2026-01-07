import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/reviewService";

const reviewService = new ReviewService();

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;

    const review = await reviewService.createReview({
      doctorId,
      appointmentId,
      rating,
      comment,
      patientId: req.user!.userId,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    next(error);
  }
};

export const getReviewsByDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { doctorId } = req.params;
    const reviews = await reviewService.getReviewsByDoctor(doctorId);

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    next(error);
  }
};
