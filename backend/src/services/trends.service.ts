// Social Trends & Sentiment data:
//   - CoinGecko /search/trending  → trending coins (free, no key)
//   - Reddit public JSON API       → top posts from r/CryptoCurrency & r/Bitcoin (no auth)
//   - alternative.me Fear & Greed  → crypto sentiment index (free, no key)

import axios from "axios";

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
  value: number;   // 0–100
  classification: string; // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
}

export interface TrendsData {
  trending: TrendingCoin[];
  reddit: RedditPost[];
  fearGreed: FearGreed | null;
}

async function fetchTrending(): Promise<TrendingCoin[]> {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/search/trending",
      { timeout: 7000 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.coins || []).slice(0, 8).map((c: any) => ({
      id: c.item.id,
      name: c.item.name,
      symbol: c.item.symbol,
      rank: c.item.market_cap_rank ?? null,
      thumb: c.item.thumb ?? "",
      priceChangePercent24h:
        c.item.data?.price_change_percentage_24h?.usd ?? null,
    }));
  } catch {
    return [];
  }
}

async function fetchReddit(): Promise<RedditPost[]> {
  try {
    const subreddits = ["CryptoCurrency", "Bitcoin"];
    const posts: RedditPost[] = [];

    for (const sub of subreddits) {
      try {
        const { data } = await axios.get(
          `https://www.reddit.com/r/${sub}/top.json`,
          {
            params: { limit: 8, t: "day" },
            headers: {
              "User-Agent": "crypto-advisor-app/1.0",
              Accept: "application/json",
            },
            timeout: 8000,
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const child of (data?.data?.children ?? []) as any[]) {
          const p = child.data;
          if (!p.stickied && p.title && (p.score ?? 0) > 5) {
            posts.push({
              id: p.id,
              title: p.title,
              url: `https://www.reddit.com${p.permalink}`,
              subreddit: p.subreddit,
              score: p.score ?? 0,
              numComments: p.num_comments ?? 0,
              createdAt: new Date(p.created_utc * 1000).toISOString(),
            });
          }
        }
      } catch {
        // skip this subreddit if it fails
      }
    }

    const seen = new Set<string>();
    return posts
      .filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  } catch {
    return [];
  }
}

async function fetchFearGreed(): Promise<FearGreed | null> {
  try {
    const { data } = await axios.get(
      "https://api.alternative.me/fng/?limit=1",
      { timeout: 5000 },
    );
    const entry = data?.data?.[0];
    if (!entry) return null;
    return {
      value: parseInt(entry.value, 10),
      classification: entry.value_classification,
    };
  } catch {
    return null;
  }
}

export async function getTrends(): Promise<TrendsData> {
  const [trendingResult, redditResult, fearGreedResult] =
    await Promise.allSettled([
      fetchTrending(),
      fetchReddit(),
      fetchFearGreed(),
    ]);

  return {
    trending:
      trendingResult.status === "fulfilled" ? trendingResult.value : [],
    reddit: redditResult.status === "fulfilled" ? redditResult.value : [],
    fearGreed:
      fearGreedResult.status === "fulfilled" ? fearGreedResult.value : null,
  };
}
