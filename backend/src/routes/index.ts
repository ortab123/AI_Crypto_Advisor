import { Router } from "express";
import authRoutes from "./auth.routes";
import onboardingRoutes from "./onboarding.routes";
import dashboardRoutes from "./dashboard.routes";
import feedbackRoutes from "./feedback.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/feedback", feedbackRoutes);

export default router;
