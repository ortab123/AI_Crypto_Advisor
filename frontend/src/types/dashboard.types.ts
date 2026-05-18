export interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface MemeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  postUrl: string;
  source: string;
  ups: number;
}

export interface DashboardProfile {
  investorType: string;
  riskTolerance: string;
  experienceLevel: string;
  investmentGoal: string;
  preferredContent: string[];
  favoriteAssets: string[];
}

export interface DashboardData {
  profile: DashboardProfile;
  prices: CoinPrice[];
  news: NewsItem[];
  insight: string;
  insightId: string;
  meme: MemeItem | null;
  userFeedback: Record<string, string>; // "contentType:contentId" -> value
}
