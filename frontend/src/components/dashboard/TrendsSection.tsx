import { useState } from "react";
import {
  TrendsData,
  TrendingCoin,
  RedditPost,
} from "../../types/dashboard.types";
import { Skeleton } from "./Skeleton";
import { timeAgo } from "./utils";

function fearGreedColor(value: number): string {
  if (value <= 20) return "text-red-500";
  if (value <= 40) return "text-orange-400";
  if (value <= 60) return "text-yellow-400";
  if (value <= 80) return "text-emerald-400";
  return "text-emerald-300";
}

function fearGreedBg(value: number): string {
  if (value <= 20) return "bg-red-500";
  if (value <= 40) return "bg-orange-400";
  if (value <= 60) return "bg-yellow-400";
  if (value <= 80) return "bg-emerald-400";
  return "bg-emerald-300";
}

const FEAR_GREED_METHODOLOGY = [
  {
    label: "Volatility",
    pct: "25%",
    desc: "Compares current BTC volatility + drawdowns to 30/90-day averages — high volatility signals fear.",
  },
  {
    label: "Market Momentum / Volume",
    pct: "25%",
    desc: "Compares current volume and market momentum to 30/90-day averages — high buying volume = greed.",
  },
  {
    label: "Social Media",
    pct: "15%",
    desc: "Counts and scores crypto-related post interactions across platforms — unusual activity spikes signal greed.",
  },
  {
    label: "Bitcoin Dominance",
    pct: "10%",
    desc: "Rising BTC dominance signals fear (capital flees to BTC); falling dominance signals greed (alt-coin speculation).",
  },
  {
    label: "Google Trends",
    pct: "10%",
    desc: "Uses Bitcoin-related Google search volumes — surging 'BTC price manipulation' queries signal fear.",
  },
];

function FearGreedCard({
  fearGreed,
}: {
  fearGreed: { value: number; classification: string } | null;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-brand-slate border border-brand-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest font-semibold text-brand-muted">
          Fear &amp; Greed Index
        </p>
        <button
          onClick={() => setShowInfo((v) => !v)}
          title="How is this calculated?"
          className="text-brand-muted hover:text-white transition-colors text-lg font-bold"
        >
          ⓘ
        </button>
      </div>

      {showInfo ? (
        <div className="space-y-2 text-[11px] text-brand-muted">
          <p className="text-white/80 font-medium text-xs mb-1">
            How the index is calculated (by alternative.me):
          </p>
          {FEAR_GREED_METHODOLOGY.map((m) => (
            <div key={m.label} className="flex gap-2">
              <span className="text-brand-red-light font-bold shrink-0 w-8">
                {m.pct}
              </span>
              <span>
                <span className="text-white/70 font-medium">{m.label}:</span>{" "}
                {m.desc}
              </span>
            </div>
          ))}
          <a
            href="https://alternative.me/crypto/fear-and-greed-index/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-brand-red-light hover:underline mt-1"
          >
            Full methodology →
          </a>
        </div>
      ) : fearGreed ? (
        <>
          <div
            className={`text-5xl font-black text-center ${fearGreedColor(fearGreed.value)}`}
          >
            {fearGreed.value}
          </div>
          <div className="w-full bg-brand-border/40 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${fearGreedBg(fearGreed.value)}`}
              style={{ width: `${fearGreed.value}%` }}
            />
          </div>
          <p
            className={`text-sm font-semibold text-center ${fearGreedColor(fearGreed.value)}`}
          >
            {fearGreed.classification}
          </p>
          <p className="text-xs text-brand-muted text-center">
            0 = Extreme Fear · 100 = Extreme Greed · tap ⓘ to see methodology
          </p>
        </>
      ) : (
        <p className="text-brand-muted text-xs text-center">
          Sentiment data unavailable
        </p>
      )}
    </div>
  );
}

function TrendingCoinChip({ coin }: { coin: TrendingCoin }) {
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

function RedditPostRow({ post }: { post: RedditPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 py-3 border-b border-brand-border/50 last:border-0 hover:bg-brand-slate-light/30 -mx-2 px-2 rounded transition-colors"
    >
      <div className="flex flex-col items-center gap-0.5 shrink-0 w-10 text-center">
        <span className="text-brand-muted text-xs">▲</span>
        <span className="text-xs font-bold text-white">
          {post.score >= 1000
            ? `${(post.score / 1000).toFixed(1)}k`
            : post.score}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white">
          {post.title}
        </p>
        <p className="text-xs text-brand-muted mt-1">
          💬 {post.numComments} · {timeAgo(post.createdAt)}
        </p>
      </div>
    </a>
  );
}

export function TrendsSection({
  trends,
  isLoading,
}: {
  trends: TrendsData | null | undefined;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted">
        Social Trends &amp; Sentiment
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-brand-slate border border-brand-border rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-3">
              Reddit Discussions
            </p>
            {trends?.reddit && trends.reddit.length > 0 ? (
              <div>
                {trends.reddit.slice(0, 5).map((post) => (
                  <RedditPostRow key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-brand-muted text-xs">
                No Reddit data available
              </p>
            )}
            <p className="text-sm text-brand-muted mt-2">top posts today</p>
          </div>

          <div className="bg-brand-slate border border-brand-border rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-4">
              🔥 Trending Assets
            </p>
            {trends?.trending.length ? (
              <div className="grid grid-cols-2 gap-2">
                {trends.trending.map((coin) => (
                  <TrendingCoinChip key={coin.id} coin={coin} />
                ))}
              </div>
            ) : (
              <p className="text-brand-muted text-xs">No trending data</p>
            )}
            <p className="text-sm text-brand-muted mt-3">
              click any coin for details
            </p>
          </div>

          <FearGreedCard fearGreed={trends?.fearGreed ?? null} />
        </div>
      )}
    </div>
  );
}
