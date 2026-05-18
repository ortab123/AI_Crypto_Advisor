export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  /** Last ~24 hourly close prices for sparkline. May be empty. */
  sparkline: number[];
}

export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string | null;
}

export interface MemeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  postUrl: string;
  source: string;
  ups: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  rank: number | null;
  thumb: string;
  priceChangePercent24h: number | null;
}

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  subreddit: string;
  score: number;
  numComments: number;
  createdAt: string;
}

export interface FearGreed {
  value: number;
  classification: string;
}

export interface TrendsData {
  trending: TrendingCoin[];
  reddit: RedditPost[];
  fearGreed: FearGreed | null;
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
  trends: TrendsData | null;
}
