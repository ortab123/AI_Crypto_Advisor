import prisma from "../db/prisma.client";

export async function saveNewsVote(data: {
  userId: string;
  voteType: string;
  cryptoAssets: string[];
  articleUrl: string;
  source: string;
  author?: string;
  articleColors?: string[];
}) {
  return prisma.newsVote.create({ data });
}

export async function saveCoinVote(data: {
  userId: string;
  coinSymbol: string;
  voteType: string;
  priceTrend: string;
  volatilityLevel: string;
}) {
  return prisma.coinVote.create({ data });
}

export async function saveInsightVote(data: {
  userId: string;
  insightId: string;
  voteType: string;
  cryptoAssets: string[];
  riskLevel: string;
}) {
  return prisma.insightVote.create({ data });
}

export async function saveMemeVote(data: {
  userId: string;
  memeId: string;
  reactionType: string;
  cryptoAssets: string[];
  memeStyle?: string;
}) {
  return prisma.memeVote.create({ data });
}

export async function saveRedditVote(data: {
  userId: string;
  postId: string;
  voteType: string;
  cryptoAssets: string[];
  postTopic?: string;
}) {
  return prisma.redditVote.create({ data });
}
