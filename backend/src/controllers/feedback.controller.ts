import { Request, Response, NextFunction } from "express";
import {
  upsertFeedback,
  removeFeedback,
  getFeedbackMap,
} from "../services/feedback.service";
import { sendSuccess, sendError } from "../utils/response.utils";

// POST /api/feedback
// Body: { contentType, contentId, value }   — value: null/missing means "remove"
export async function setFeedbackHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { contentType, contentId, value } = req.body;
    if (!contentType || !contentId) {
      sendError(res, "contentType and contentId are required", 400);
      return;
    }
    if (!value) {
      await removeFeedback(req.user!.userId, contentType, contentId);
      sendSuccess(res, null, 200, "Feedback removed");
    } else {
      await upsertFeedback(req.user!.userId, contentType, contentId, value);
      sendSuccess(res, null, 200, "Feedback saved");
    }
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback
export async function getFeedbackHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const map = await getFeedbackMap(req.user!.userId);
    sendSuccess(res, map);
  } catch (err) {
    next(err);
  }
}
