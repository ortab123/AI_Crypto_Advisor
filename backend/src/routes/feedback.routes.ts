import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  setFeedbackHandler,
  getFeedbackHandler,
} from "../controllers/feedback.controller";

const router = Router();

router.use(authMiddleware);
router.post("/", setFeedbackHandler);
router.get("/", getFeedbackHandler);

export default router;
