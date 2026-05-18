import { Request, Response, NextFunction } from 'express';
import { savePreferences, getPreferences } from '../services/onboarding.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { OnboardingData } from '../types/onboarding.types';

export async function submitOnboarding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const preferences = await savePreferences(req.user!.userId, req.body as OnboardingData);
    sendSuccess(res, preferences, 200, 'Preferences saved');
  } catch (err) {
    next(err);
  }
}

export async function getOnboarding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const preferences = await getPreferences(req.user!.userId);
    if (!preferences) {
      sendError(res, 'No preferences found', 404);
      return;
    }
    sendSuccess(res, preferences);
  } catch (err) {
    next(err);
  }
}
