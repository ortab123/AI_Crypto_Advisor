// Crypto news via CoinGecko /news — same free public API used for prices,
// no API key required. Falls back to static headlines if the request fails.

import axios from "axios";

const BASE = "https://api.coingecko.com/api/v3";

// Map user-facing asset names to search keywords for relevance filtering.
const ASSET_KEYWORDS: Record<string, string[]> = {
  "Bitcoin (BTC)": ["bitcoin", "btc"],
  "Ethereum (ETH)": ["ethereum", "eth"],
  "Solana (SOL)": ["solana", "sol"],
  XRP: ["xrp", "ripple"],
  "Dogecoin (DOGE)": ["dogecoin", "doge"],
};

export interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

// Static fallback used only when CoinGecko is unreachable.
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Bitcoin Hits New Milestone as Institutional Demand Surges",
    url: "https://coindesk.com",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 2,
    title: "Ethereum Layer-2 Ecosystem Sees Record Transaction Volume",
    url: "https://cointelegraph.com",
    source: "CoinTelegraph",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 3,
    title: "Solana DeFi TVL Climbs 40% in Q1 as Developer Activity Rises",
    url: "https://decrypt.co",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 4,
    title: "XRP Legal Clarity Boosts Cross-Border Payment Adoption",
    url: "https://coindesk.com",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 5,
    title: "Dogecoin Community Launches New Utility Proposal",
    url: "https://cointelegraph.com",
    source: "CoinTelegraph",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 6,
    title: "Crypto Market Sentiment Turns Bullish Amid Macro Tailwinds",
    url: "https://decrypt.co",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
];

export async function getNews(
  assets: string[],
  limit = 6,
): Promise<NewsItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await axios.get<any[]>(`${BASE}/news`, {
      params: { per_page: 50 },
      timeout: 8000,
    });

    const keywords = assets.flatMap((a) => ASSET_KEYWORDS[a] ?? []);

    // Prefer articles that mention at least one of the user's assets.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relevant = (data || []).filter((item: any) => {
      const text = (item.title + " " + (item.description ?? "")).toLowerCase();
      return keywords.some((k) => text.includes(k));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seen = new Set(relevant.map((i: any) => i.id));
    const all = [
      ...relevant,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(data || []).filter((i: any) => !seen.has(i.id)),
    ].slice(0, limit);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return all.map((item: any, idx: number) => ({
      id: item.id ?? idx,
      title: item.title,
      url: item.url,
      source: item.author ?? item.news_site ?? "CoinGecko News",
      publishedAt: item.updated_at
        ? new Date(item.updated_at * 1000).toISOString()
        : new Date().toISOString(),
    }));
  } catch {
    // CoinGecko unreachable — serve static fallback so the UI never breaks.
    return FALLBACK_NEWS.slice(0, limit);
  }
}
