import axios from "axios";
import { ASSET_MAP } from "../config/assets.config";
import { env } from "../config/env.config";

const BASE = env.COINGECKO_BASE_URL;

// ---------------------------------------------------------------------------
// In-memory caches to avoid hammering CoinGecko's free-tier rate limits.
// ---------------------------------------------------------------------------

/** Cache for resolved coin metadata from /search (coin IDs never change). */
const searchCache = new Map<
  string,
  { id: string; symbol: string; name: string }
>();

/** Cache entry for a full prices response. */
interface PricesCacheEntry {
  data: CoinPrice[];
  expiresAt: number;
}
/** Key = sorted, joined coin IDs. TTL = 5 minutes. */
const pricesCache = new Map<string, PricesCacheEntry>();
const PRICES_TTL_MS = 5 * 60 * 1000; // 5 minutes

function lookupAsset(
  name: string,
): { id: string; symbol: string; name: string } | undefined {
  return (
    ASSET_MAP[name] ||
    ASSET_MAP[name.toUpperCase()] ||
    Object.values(
      Object.fromEntries(
        Object.entries(ASSET_MAP).filter(
          ([k]) => k.toLowerCase() === name.toLowerCase(),
        ),
      ),
    )[0]
  );
}

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  /** Last ~24 hourly price points for sparkline graph (may be empty). */
  sparkline: number[];
  /** True when all price endpoints failed (e.g. rate-limited). Name/symbol still valid. */
  priceUnavailable?: boolean;
}

/** Search CoinGecko for a coin by name/ticker. Returns the top match or null. */
async function searchCoin(
  query: string,
): Promise<{ id: string; symbol: string; name: string } | null> {
  const key = query.toLowerCase();
  const cached = searchCache.get(key);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await axios.get<any>(`${BASE}/search`, {
      params: { query },
      headers: env.COINGECKO_API_KEY
        ? { "x-cg-demo-api-key": env.COINGECKO_API_KEY }
        : {},
      timeout: 5000,
    });
    const coins: any[] = data?.coins ?? [];
    if (coins.length === 0) return null;

    // Prefer an exact symbol match (case-insensitive) over the first result.
    // This avoids picking the wrong token when multiple coins share a ticker (e.g. MORPHO, KCS).
    const upperQuery = query.toUpperCase();
    const hit =
      coins.find(
        (c: any) => (c.symbol as string).toUpperCase() === upperQuery,
      ) ?? coins[0];

    const result = {
      id: hit.id as string,
      symbol: (hit.symbol as string).toUpperCase(),
      name: hit.name as string,
    };
    searchCache.set(key, result); // permanent — coin IDs never change
    return result;
  } catch {
    return null;
  }
}

export async function getCoinPrices(assets: string[]): Promise<CoinPrice[]> {
  // Resolve each asset: static map first, then CoinGecko search for unknowns
  const resolved = await Promise.all(
    assets.map(async (a) => lookupAsset(a) ?? (await searchCoin(a))),
  );

  // Deduplicate by CoinGecko ID (prevents showing the same coin multiple times)
  const seen = new Set<string>();
  const coins = resolved.filter(
    (c): c is { id: string; symbol: string; name: string } => {
      if (!c) return false;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    },
  );
  if (coins.length === 0) return [];

  const ids = coins
    .map((c) => c.id)
    .sort()
    .join(",");

  // Return cached prices if still fresh
  const cached = pricesCache.get(ids);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  try {
    // /coins/markets returns price + 7-day sparkline in one call (free tier).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await axios.get<any[]>(`${BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        ids,
        price_change_percentage: "24h",
        sparkline: true,
      },
      headers: env.COINGECKO_API_KEY
        ? { "x-cg-demo-api-key": env.COINGECKO_API_KEY }
        : {},
      timeout: 10000,
    });

    const result = coins.map((coin) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = (data || []).find((item: any) => item.id === coin.id);
      const raw: number[] = d?.sparkline_in_7d?.price ?? [];
      // Last 24 data points ≈ last 24 hours
      const sparkline = raw.slice(-24);
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: d?.current_price ?? 0,
        change24h: d?.price_change_percentage_24h ?? 0,
        sparkline,
      };
    });
    pricesCache.set(ids, {
      data: result,
      expiresAt: Date.now() + PRICES_TTL_MS,
    });
    return result;
  } catch {
    // Fallback: simple/price (no sparkline) if markets endpoint fails
    try {
      const { data } = await axios.get(`${BASE}/simple/price`, {
        params: { ids, vs_currencies: "usd", include_24hr_change: true },
        headers: env.COINGECKO_API_KEY
          ? { "x-cg-demo-api-key": env.COINGECKO_API_KEY }
          : {},
        timeout: 8000,
      });
      const result = coins.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: data[coin.id]?.usd ?? 0,
        change24h: data[coin.id]?.usd_24h_change ?? 0,
        sparkline: [],
      }));
      pricesCache.set(ids, {
        data: result,
        expiresAt: Date.now() + PRICES_TTL_MS,
      });
      return result;
    } catch {
      // Both endpoints failed (rate-limited or network error).
      // Return the known coins with priceUnavailable so the dashboard can still show them.
      return coins.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: 0,
        change24h: 0,
        sparkline: [],
        priceUnavailable: true,
      }));
    }
  }
}
