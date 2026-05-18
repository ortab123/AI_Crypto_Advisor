// Crypto news via RSS feeds from CoinTelegraph, CoinDesk, and Decrypt.
// No API key required. Returns direct article URLs + cover images.

import axios from "axios";

const RSS_FEEDS = [
  { url: "https://cointelegraph.com/rss", source: "CoinTelegraph" },
  {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    source: "CoinDesk",
  },
  { url: "https://decrypt.co/feed", source: "Decrypt" },
];

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
  imageUrl: string | null;
}

// ── Simple RSS helpers ────────────────────────────────────────────────────────

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1").trim();
}

function extractTag(xml: string, tag: string): string {
  const m =
    xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) ??
    xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}`, "i"));
  return m ? stripCdata(m[1]).trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(
    new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i"),
  );
  return m ? m[1].trim() : "";
}

function extractImage(item: string): string | null {
  // 1. <media:content url="...">
  let img = extractAttr(item, "media:content", "url");
  if (img) return img;
  // 2. <enclosure url="..." type="image/...">
  const enc = item.match(/<enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i);
  if (enc) return enc[1];
  const enc2 = item.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image[^"]*"/i);
  if (enc2) return enc2[1];
  // 3. <media:thumbnail url="...">
  img = extractAttr(item, "media:thumbnail", "url");
  if (img) return img;
  // 4. First <img src="..."> in description
  const descBlock = item.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "";
  const imgMatch = descBlock.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return null;
}

function extractLink(item: string): string {
  // Prefer <link> CDATA
  const cdataLink = item.match(/<link><!\[CDATA\[([\s\S]*?)]]><\/link>/i);
  if (cdataLink) return cdataLink[1].split("?")[0].trim(); // strip UTM
  // Plain <link>
  const plain = item.match(/<link>(https?[^<]+)<\/link>/i);
  if (plain) return plain[1].trim();
  // <guid isPermaLink="true">
  const guid = item.match(/<guid[^>]*isPermaLink="true"[^>]*>(https?[^<]+)<\/guid>/i);
  if (guid) return guid[1].trim();
  return "";
}

interface ParsedItem {
  title: string;
  url: string;
  imageUrl: string | null;
  pubDate: string;
  source: string;
}

function parseRss(xml: string, source: string): ParsedItem[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];
  return items.flatMap((block) => {
    const title = extractTag(block, "title");
    const url = extractLink(block);
    if (!title || !url) return [];
    const imageUrl = extractImage(block);
    const pubDate =
      extractTag(block, "pubDate") || extractTag(block, "atom:updated");
    return [{ title, url, imageUrl, pubDate, source }];
  });
}

// Static fallback (used only when all RSS feeds fail simultaneously)
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Bitcoin Hits New Milestone as Institutional Demand Surges",
    url: "https://coindesk.com/markets",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    imageUrl: null,
  },
  {
    id: 2,
    title: "Ethereum Layer-2 Ecosystem Sees Record Transaction Volume",
    url: "https://cointelegraph.com",
    source: "CoinTelegraph",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    imageUrl: null,
  },
  {
    id: 3,
    title: "Solana DeFi TVL Climbs 40% as Developer Activity Rises",
    url: "https://decrypt.co",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    imageUrl: null,
  },
  {
    id: 4,
    title: "XRP Legal Clarity Boosts Cross-Border Payment Adoption",
    url: "https://coindesk.com/policy",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    imageUrl: null,
  },
  {
    id: 5,
    title: "Dogecoin Community Launches New Utility Proposal",
    url: "https://cointelegraph.com",
    source: "CoinTelegraph",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    imageUrl: null,
  },
  {
    id: 6,
    title: "Crypto Market Sentiment Turns Bullish Amid Macro Tailwinds",
    url: "https://decrypt.co",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    imageUrl: null,
  },
];

export async function getNews(
  assets: string[],
  limit = 6,
): Promise<NewsItem[]> {
  try {
    const feeds = await Promise.allSettled(
      RSS_FEEDS.map(({ url, source }) =>
        axios
          .get<string>(url, {
            timeout: 8000,
            headers: { Accept: "application/rss+xml, application/xml, text/xml" },
          })
          .then((r) => parseRss(r.data, source)),
      ),
    );

    const all: ParsedItem[] = feeds.flatMap((r) =>
      r.status === "fulfilled" ? r.value : [],
    );

    if (all.length === 0) return FALLBACK_NEWS.slice(0, limit);

    const keywords = assets.flatMap((a) => ASSET_KEYWORDS[a] ?? []);

    const relevant = all.filter(({ title }) => {
      const t = title.toLowerCase();
      return keywords.some((k) => t.includes(k));
    });

    const seen = new Set(relevant.map((i) => i.url));
    const rest = all.filter((i) => !seen.has(i.url));
    const merged = [...relevant, ...rest].slice(0, limit);

    return merged.map((item, idx) => ({
      id: idx + 1,
      title: item.title,
      url: item.url,
      source: item.source,
      publishedAt: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      imageUrl: item.imageUrl,
    }));
  } catch {
    return FALLBACK_NEWS.slice(0, limit);
  }
}
