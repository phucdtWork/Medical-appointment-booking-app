import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  addManyDoctors,
} from "../controllers/doctorController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/bulk", addManyDoctors);

export default router;
