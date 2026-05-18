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
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export async function getCoinPrices(assets: string[]): Promise<CoinPrice[]> {
  const coins = assets.map((a) => ASSET_MAP[a]).filter(Boolean);
  if (coins.length === 0) return [];

  const ids = coins.map((c) => c.id).join(",");
  const { data } = await axios.get(`${BASE}/simple/price`, {
    params: { ids, vs_currencies: "usd", include_24hr_change: true },
    timeout: 8000,
  });

  return coins.map((coin) => ({
    symbol: coin.symbol,
    name: coin.name,
    price: data[coin.id]?.usd ?? 0,
    change24h: data[coin.id]?.usd_24h_change ?? 0,
  }));
}
