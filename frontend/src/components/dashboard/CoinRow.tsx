import { useState } from "react";
import { CoinPrice } from "../../types/dashboard.types";
import { Sparkline } from "./Sparkline";
import { formatPrice } from "./utils";

export function CoinRow({ coin }: { coin: CoinPrice }) {
  const [expanded, setExpanded] = useState(false);
  const up = coin.change24h >= 0;
  const unavailable = coin.priceUnavailable === true;

  const sparkHigh = coin.sparkline.length ? Math.max(...coin.sparkline) : null;
  const sparkLow = coin.sparkline.length ? Math.min(...coin.sparkline) : null;

  return (
    <div className="border-b border-brand-border/60 last:border-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full py-3.5 gap-3 text-left hover:bg-brand-slate-light/20 -mx-1 px-1 rounded transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-xs font-black text-white">
            {coin.symbol.slice(0, 3)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white">{coin.symbol}</p>
            <p className="text-xs text-brand-muted">{coin.name}</p>
          </div>
        </div>
        {coin.sparkline.length >= 2 && (
          <Sparkline data={coin.sparkline} up={up} />
        )}
        <div className="text-right shrink-0">
          {unavailable ? (
            <p className="text-xs text-brand-muted italic">Price unavailable</p>
          ) : (
            <>
              <p className="font-bold text-white">{formatPrice(coin.price)}</p>
              <p
                className={`text-xs font-semibold mt-0.5 ${
                  up ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {up ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
              </p>
            </>
          )}
        </div>
        <span className="text-brand-muted text-xs shrink-0 ml-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="mb-3 bg-brand-slate-deep/70 border border-brand-red/20 rounded-xl px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Price</span>
              <span className="text-white font-semibold">
                {formatPrice(coin.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">24h Change</span>
              <span
                className={`font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}
              >
                {up ? "+" : ""}
                {coin.change24h.toFixed(2)}%
              </span>
            </div>
            {sparkHigh !== null && (
              <div className="flex justify-between">
                <span className="text-brand-muted">24h High (est.)</span>
                <span className="text-white font-semibold">
                  {formatPrice(sparkHigh)}
                </span>
              </div>
            )}
            {sparkLow !== null && (
              <div className="flex justify-between">
                <span className="text-brand-muted">24h Low (est.)</span>
                <span className="text-white font-semibold">
                  {formatPrice(sparkLow)}
                </span>
              </div>
            )}
          </div>
          <a
            href={`https://www.coingecko.com/en/coins/${coin.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-brand-red-light hover:underline pt-1"
          >
            View full details on CoinGecko →
          </a>
        </div>
      )}
    </div>
  );
}
