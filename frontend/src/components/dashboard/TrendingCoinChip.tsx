import { useState } from "react";
import { TrendingCoin } from "../../types/dashboard.types";

export function TrendingCoinChip({ coin }: { coin: TrendingCoin }) {
  const [expanded, setExpanded] = useState(false);
  const up =
    coin.priceChangePercent24h !== null && coin.priceChangePercent24h >= 0;
  const hasChange = coin.priceChangePercent24h !== null;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center gap-2 bg-brand-slate-deep border rounded-xl px-3 py-2.5 transition-all text-left w-full ${
          expanded
            ? "border-brand-red/60 bg-brand-red/5"
            : "border-brand-border hover:border-brand-red/40"
        }`}
      >
        {coin.thumb ? (
          <img
            src={coin.thumb}
            alt={coin.symbol}
            className="w-6 h-6 rounded-full shrink-0"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-brand-red/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {coin.symbol.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-none">
            {coin.symbol}
          </p>
          <p className="text-xs text-brand-muted mt-0.5 leading-none truncate">
            {coin.name}
          </p>
        </div>
        {hasChange && (
          <span
            className={`text-xs font-semibold ml-auto shrink-0 ${up ? "text-emerald-400" : "text-red-400"}`}
          >
            {up ? "▲" : "▼"} {Math.abs(coin.priceChangePercent24h!).toFixed(1)}%
          </span>
        )}
      </button>

      {expanded && (
        <div className="mt-1 bg-brand-slate-deep/80 border border-brand-red/20 rounded-xl px-3 py-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-muted">Market Cap Rank</span>
            <span className="text-white font-semibold">
              {coin.rank ? `#${coin.rank}` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">24h Change</span>
            <span
              className={`font-semibold ${hasChange ? (up ? "text-emerald-400" : "text-red-400") : "text-brand-muted"}`}
            >
              {hasChange
                ? `${up ? "+" : ""}${coin.priceChangePercent24h!.toFixed(2)}%`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Trending on</span>
            <span className="text-white font-semibold">CoinGecko</span>
          </div>
          <a
            href={`https://www.coingecko.com/en/coins/${coin.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-brand-red-light hover:underline pt-0.5"
          >
            View full details →
          </a>
        </div>
      )}
    </div>
  );
}
