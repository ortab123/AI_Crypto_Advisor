import apiClient from "../utils/api.utils";
import { ApiResponse } from "../types/api.types";
import { DashboardData } from "../types/dashboard.types";

export async function fetchDashboardApi(): Promise<DashboardData> {
  const res = await apiClient.get<ApiResponse<DashboardData>>("/dashboard");
  return res.data.data!;
}

export async function submitFeedbackApi(
  contentType: string,
  contentId: string,
  value: string | null,
): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/feedback", {
    contentType,
    contentId,
    value,
  });
}

export async function submitNewsVoteApi(payload: {
  voteType: string;
  cryptoAssets: string[];
  articleUrl: string;
  source: string;
  author?: string;
  articleColors?: string[];
}): Promise<void> {
  await apiClient.post("/votes/news", payload);
}

export async function submitCoinVoteApi(payload: {
  coinSymbol: string;
  voteType: string;
  priceTrend: string;
  volatilityLevel: string;
}): Promise<void> {
  await apiClient.post("/votes/coin", payload);
}

export async function submitInsightVoteApi(payload: {
  insightId: string;
  voteType: string;
  cryptoAssets: string[];
  riskLevel: string;
}): Promise<void> {
  await apiClient.post("/votes/insight", payload);
}

export async function submitMemeVoteApi(payload: {
  memeId: string;
  reactionType: string;
  cryptoAssets: string[];
  memeStyle?: string;
}): Promise<void> {
  await apiClient.post("/votes/meme", payload);
}

export async function submitRedditVoteApi(payload: {
  postId: string;
  voteType: string;
  cryptoAssets: string[];
  postTopic?: string;
}): Promise<void> {
  await apiClient.post("/votes/reddit", payload);
}
