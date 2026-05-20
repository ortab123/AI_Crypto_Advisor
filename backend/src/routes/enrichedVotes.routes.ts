import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  newsVoteHandler,
  coinVoteHandler,
  insightVoteHandler,
  memeVoteHandler,
  redditVoteHandler,
} from "../controllers/enrichedVotes.controller";

const router = Router();

router.use(authMiddleware);

router.post("/news", newsVoteHandler);
router.post("/coin", coinVoteHandler);
router.post("/insight", insightVoteHandler);
router.post("/meme", memeVoteHandler);
router.post("/reddit", redditVoteHandler);

export default router;
