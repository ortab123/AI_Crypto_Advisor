import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getPreferences } from "../services/onboarding.service";
import { getCoinPrices } from "../services/coingecko.service";
import { getNews } from "../services/cryptopanic.service";
import { generateInsight } from "../services/ai.service";
import { getMeme } from "../services/meme.service";
import { getFeedbackMap } from "../services/feedback.service";
import { sendSuccess, sendError } from "../utils/response.utils";

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const preferences = await getPreferences(req.user!.userId);
    if (!preferences) {
      sendError(res, "Complete onboarding first", 404);
      return;
    }

    // Fetch all external sources + user feedback in parallel
    const [
      pricesResult,
      newsResult,
      insightResult,
      memeResult,
      feedbackResult,
    ] = await Promise.allSettled([
      getCoinPrices(preferences.favoriteAssets),
      getNews(preferences.favoriteAssets),
      generateInsight(
        preferences.favoriteAssets,
        preferences.investorType,
        preferences.riskTolerance,
      ),
      getMeme(),
      getFeedbackMap(req.user!.userId),
    ]);

    const insight =
      insightResult.status === "fulfilled"
        ? insightResult.value
        : (() => {
            console.error(
              "AI insight failed:",
              (insightResult as PromiseRejectedResult).reason,
            );
            return "AI insight unavailable at this time.";
          })();

    const insightId = crypto
      .createHash("sha1")
      .update(insight)
      .digest("hex")
      .slice(0, 12);

    sendSuccess(res, {
      profile: {
        investorType: preferences.investorType,
        riskTolerance: preferences.riskTolerance,
        experienceLevel: preferences.experienceLevel,
        investmentGoal: preferences.investmentGoal,
        preferredContent: preferences.preferredContent,
        favoriteAssets: preferences.favoriteAssets,
      },
      prices: pricesResult.status === "fulfilled" ? pricesResult.value : [],
      news: newsResult.status === "fulfilled" ? newsResult.value : [],
      insight,
      insightId,
      meme: memeResult.status === "fulfilled" ? memeResult.value : null,
      userFeedback:
        feedbackResult.status === "fulfilled" ? feedbackResult.value : {},
    });
  } catch (err) {
    next(err);
  }
}
