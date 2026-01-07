import { Router } from "express";
import {
  createReview,
  getReviewsByDoctor,
} from "../controllers/reviewController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Create review (patient)
router.post("/", authenticate, createReview);

// Get reviews for doctor (public)
router.get("/doctor/:doctorId", getReviewsByDoctor);

export default router;
