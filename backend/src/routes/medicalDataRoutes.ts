import { Router, Request, Response, NextFunction } from "express";
import { MedicalDataService } from "../services/medicalDataService";

const router = Router();

/**
 * GET /api/medical-data/conditions
 * Get list of medical conditions
 * Query param: search (optional) - filter conditions by search term
 */
router.get(
  "/conditions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const conditions = MedicalDataService.getMedicalConditions(search);

      res.json({
        success: true,
        data: conditions,
        count: conditions.length,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/medical-data/allergies
 * Get list of common allergies
 * Query param: search (optional) - filter allergies by search term
 */
router.get(
  "/allergies",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const allergies = MedicalDataService.getAllergies(search);

      res.json({
        success: true,
        data: allergies,
        count: allergies.length,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/medical-data/validate-allergy
 * Validate if allergen exists in known list
 */
router.post(
  "/validate-allergy",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { allergen } = req.body;

      if (!allergen || typeof allergen !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid allergen parameter",
        });
      }

      const isValid = MedicalDataService.validateAllergy(allergen);
      res.json({
        success: true,
        isValid,
        allergen,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/medical-data/validate-condition
 * Validate if medical condition exists in known list
 */
router.post(
  "/validate-condition",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { condition } = req.body;

      if (!condition || typeof condition !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid condition parameter",
        });
      }

      const isValid = MedicalDataService.validateMedicalCondition(condition);
      res.json({
        success: true,
        isValid,
        condition,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
