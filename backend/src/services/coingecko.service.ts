import axios from "axios";

const BASE = "https://api.coingecko.com/api/v3";

const ASSET_MAP: Record<string, { id: string; symbol: string; name: string }> =
  {
    "Bitcoin (BTC)": { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    "Ethereum (ETH)": { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    "Solana (SOL)": { id: "solana", symbol: "SOL", name: "Solana" },
    XRP: { id: "ripple", symbol: "XRP", name: "XRP" },
    "Dogecoin (DOGE)": { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  };

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  /** Last ~24 hourly price points for sparkline graph (may be empty). */
  sparkline: number[];
}

export async function getCoinPrices(assets: string[]): Promise<CoinPrice[]> {
  const coins = assets.map((a) => ASSET_MAP[a]).filter(Boolean);
  if (coins.length === 0) return [];

  const ids = coins.map((c) => c.id).join(",");

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
      timeout: 10000,
    });

    return coins.map((coin) => {
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
  } catch {
    // Fallback: simple/price (no sparkline) if markets endpoint fails
    const { data } = await axios.get(`${BASE}/simple/price`, {
      params: { ids, vs_currencies: "usd", include_24hr_change: true },
      timeout: 8000,
    });
    return coins.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      price: data[coin.id]?.usd ?? 0,
      change24h: data[coin.id]?.usd_24h_change ?? 0,
      sparkline: [],
    }));
  }
}
