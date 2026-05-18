import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  submitOnboarding,
  getOnboarding,
} from "../controllers/onboarding.controller";

const onboardingRules = [
  body("favoriteAssets")
    .isArray({ min: 1 })
    .withMessage("Select at least one asset"),
  body("investorType").notEmpty().withMessage("Investor type is required"),
  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required"),
  body("riskTolerance").notEmpty().withMessage("Risk tolerance is required"),
  body("investmentGoal").notEmpty().withMessage("Investment goal is required"),
];

const router = Router();

router.post("/", authMiddleware, onboardingRules, validate, submitOnboarding);
router.get("/", authMiddleware, getOnboarding);

export default router;
