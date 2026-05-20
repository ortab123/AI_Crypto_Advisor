import { Request, Response, NextFunction } from "express";
import {
  saveNewsVote,
  saveCoinVote,
  saveInsightVote,
  saveMemeVote,
  saveRedditVote,
} from "../services/enrichedVotes.service";
import { sendSuccess, sendError } from "../utils/response.utils";

export async function newsVoteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { voteType, cryptoAssets, articleUrl, source, author, articleColors } = req.body;
    if (!voteType || !articleUrl || !source) {
      sendError(res, "voteType, articleUrl and source are required", 400);
      return;
    }
    await saveNewsVote({
      userId: req.user!.userId,
      voteType,
      cryptoAssets: cryptoAssets ?? [],
      articleUrl,
      source,
      author,
      articleColors: articleColors ?? [],
    });
    sendSuccess(res, null, 201, "News vote saved");
  } catch (err) {
    next(err);
  }
}

export async function coinVoteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { coinSymbol, voteType, priceTrend, volatilityLevel } = req.body;
    if (!coinSymbol || !voteType || !priceTrend || !volatilityLevel) {
      sendError(res, "coinSymbol, voteType, priceTrend and volatilityLevel are required", 400);
      return;
    }
    await saveCoinVote({ userId: req.user!.userId, coinSymbol, voteType, priceTrend, volatilityLevel });
    sendSuccess(res, null, 201, "Coin vote saved");
  } catch (err) {
    next(err);
  }
}

export async function insightVoteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { insightId, voteType, cryptoAssets, riskLevel } = req.body;
    if (!insightId || !voteType || !riskLevel) {
      sendError(res, "insightId, voteType and riskLevel are required", 400);
      return;
    }
    await saveInsightVote({
      userId: req.user!.userId,
      insightId,
      voteType,
      cryptoAssets: cryptoAssets ?? [],
      riskLevel,
    });
    sendSuccess(res, null, 201, "Insight vote saved");
  } catch (err) {
    next(err);
  }
}

export async function memeVoteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { memeId, reactionType, cryptoAssets, memeStyle } = req.body;
    if (!memeId || !reactionType) {
      sendError(res, "memeId and reactionType are required", 400);
      return;
    }
    await saveMemeVote({
      userId: req.user!.userId,
      memeId,
      reactionType,
      cryptoAssets: cryptoAssets ?? [],
      memeStyle,
    });
    sendSuccess(res, null, 201, "Meme vote saved");
  } catch (err) {
    next(err);
  }
}

export async function redditVoteHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { postId, voteType, cryptoAssets, postTopic } = req.body;
    if (!postId || !voteType) {
      sendError(res, "postId and voteType are required", 400);
      return;
    }
    await saveRedditVote({
      userId: req.user!.userId,
      postId,
      voteType,
      cryptoAssets: cryptoAssets ?? [],
      postTopic,
    });
    sendSuccess(res, null, 201, "Reddit vote saved");
  } catch (err) {
    next(err);
  }
}
