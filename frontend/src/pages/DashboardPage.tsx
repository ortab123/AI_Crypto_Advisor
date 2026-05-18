import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { useDashboard } from "../hooks/useDashboard";
import {
  CoinPrice,
  NewsItem,
  MemeItem,
  TrendsData,
  TrendingCoin,
  RedditPost,
} from "../types/dashboard.types";
import { submitFeedbackApi } from "../services/dashboard.service";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price > 1000)
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price > 1)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(4)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Micro components ────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-brand-border/30 animate-pulse rounded-lg ${className}`}
    />
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-brand-slate-deep border border-brand-border rounded-full px-3 py-1.5">
      <span className="text-brand-muted text-xs uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className="text-white text-xs font-semibold">{value}</span>
    </div>
  );
}

// ─── Sparkline SVG ───────────────────────────────────────────────────────────

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 76;
  const H = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const color = up ? "#34d399" : "#f87171";
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function CoinRow({ coin }: { coin: CoinPrice }) {
  const [expanded, setExpanded] = useState(false);
  const up = coin.change24h >= 0;

  // 24h high/low estimates from sparkline
  const sparkHigh = coin.sparkline.length ? Math.max(...coin.sparkline) : null;
  const sparkLow = coin.sparkline.length ? Math.min(...coin.sparkline) : null;

  return (
    <div className="border-b border-brand-border/60 last:border-0">
      {/* Main row — click to expand */}
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
        {/* Sparkline */}
        {coin.sparkline.length >= 2 && (
          <Sparkline data={coin.sparkline} up={up} />
        )}
        <div className="text-right shrink-0">
          <p className="font-bold text-white">{formatPrice(coin.price)}</p>
          <p
            className={`text-xs font-semibold mt-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}
          >
            {up ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
          </p>
        </div>
        <span className="text-brand-muted text-xs shrink-0 ml-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mb-3 bg-brand-slate-deep/70 border border-brand-red/20 rounded-xl px-4 py-3 space-y-2 text-[11px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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

function NewsCard({
  item,
  starred,
  onStar,
}: {
  item: NewsItem;
  starred: boolean;
  onStar: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const showImg = !!item.imageUrl && !imgErr;

  return (
    <div className="group relative flex flex-col bg-brand-slate border border-brand-border rounded-xl overflow-hidden hover:border-brand-red/50 hover:bg-brand-slate-light transition-all duration-200">
      {/* Star button */}
      <button
        onClick={onStar}
        title={starred ? "Remove from favorites" : "Save — get similar news"}
        className={`absolute top-3 right-3 z-10 text-lg transition-transform hover:scale-125 ${
          starred ? "text-yellow-400" : "text-brand-muted hover:text-yellow-300"
        }`}
      >
        {starred ? "★" : "☆"}
      </button>

      {/* Article thumbnail */}
      {showImg && (
        <div className="h-36 overflow-hidden bg-brand-slate-deep">
          <img
            src={item.imageUrl!}
            alt=""
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pr-6"
        >
          <p className="text-sm text-white/90 font-medium leading-snug line-clamp-3 group-hover:text-white">
            {item.title}
          </p>
        </a>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-brand-red/10 text-brand-red-light border border-brand-red/20 px-2 py-0.5 rounded-full font-medium">
              {item.source}
            </span>
          </div>
          <span className="text-xs text-brand-muted">
            {timeAgo(item.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  insight,
  insightId,
  favoriteAssets,
  isLoading,
  feedback,
  onFeedback,
}: {
  insight: string | undefined;
  insightId: string | undefined;
  favoriteAssets: string[];
  isLoading: boolean;
  feedback: string | undefined;
  onFeedback: (value: string) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-brand-red/15 via-brand-slate to-brand-slate-deep rounded-xl border border-brand-red/25 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-base shadow">
          ✦
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">
            AI Insight of the Day
          </h2>
          <p className="text-xs text-brand-muted">Groq · Llama 3.1</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : (
        <blockquote className="text-white/90 text-base leading-relaxed italic border-l-2 border-brand-red pl-4">
          "{insight}"
        </blockquote>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-1.5 flex-wrap">
          {favoriteAssets
            .filter((a) => a !== "Other...")
            .map((a) => (
              <span
                key={a}
                className="text-xs bg-white/8 text-white/60 border border-white/10 px-2 py-0.5 rounded-full"
              >
                {a.replace(/\(.*\)/, "").trim()}
              </span>
            ))}
        </div>

        {!isLoading && insightId && (
          <div className="flex items-center gap-1 ml-4 shrink-0">
            <span className="text-xs text-brand-muted mr-1">Helpful?</span>
            <button
              onClick={() => onFeedback("up")}
              title="Helpful — show me more like this"
              className={`text-xl transition-transform hover:scale-125 ${
                feedback === "up"
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-80"
              }`}
            >
              👍
            </button>
            <button
              onClick={() => onFeedback("down")}
              title="Not helpful"
              className={`text-xl transition-transform hover:scale-125 ${
                feedback === "down"
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-80"
              }`}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const MEME_REACTIONS = [
  { value: "laugh", emoji: "😂", label: "Haha" },
  { value: "love", emoji: "❤️", label: "Love" },
  { value: "angry", emoji: "😡", label: "Rage" },
];

function MemeCard({
  meme,
  isLoading,
  feedback,
  onFeedback,
}: {
  meme: MemeItem | null | undefined;
  isLoading: boolean;
  feedback: string | undefined;
  onFeedback: (value: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const showText = !meme?.imageUrl || imgError;

  return (
    <div className="bg-brand-slate rounded-xl border border-brand-border overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-brand-border/50">
        <span className="text-2xl">🎭</span>
        <div>
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted">
            Crypto Meme of the Day
          </h2>
          {meme && (
            <p className="text-xs text-brand-muted mt-0.5">
              {meme.source} · ▲ {meme.ups.toLocaleString()} upvotes
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-none" />
      ) : !meme ? (
        <div className="p-10 text-center text-brand-muted text-sm">
          No meme today 😔
        </div>
      ) : showText ? (
        /* Text-only fallback meme */
        <div className="flex flex-col items-center justify-center px-8 py-12 gap-6 bg-gradient-to-br from-brand-slate-deep to-brand-slate min-h-52">
          <p className="text-4xl">🤣</p>
          <p className="text-xl font-bold text-white text-center leading-snug max-w-lg">
            {meme.title}
          </p>
          <a
            href={meme.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-muted hover:text-white transition-colors"
          >
            {meme.source} →
          </a>
        </div>
      ) : (
        /* Image meme */
        <div className="relative bg-black flex items-center justify-center max-h-[420px] overflow-hidden">
          <img
            src={meme.imageUrl!}
            alt={meme.title}
            onError={() => setImgError(true)}
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      )}

      {/* Caption + reactions */}
      {!isLoading && meme && (
        <div className="px-6 py-4 space-y-3">
          {!showText && (
            <p className="text-sm font-medium text-white/90 line-clamp-2">
              {meme.title}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-brand-muted">
              How does this make you feel?
            </span>
            <div className="flex gap-2 ml-auto">
              {MEME_REACTIONS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => onFeedback(value)}
                  title={label}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    feedback === value
                      ? "bg-brand-red/20 border-brand-red/60 text-white scale-110"
                      : "border-brand-border text-brand-muted hover:border-brand-red/40 hover:text-white hover:scale-105"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Social Trends & Sentiment ───────────────────────────────────────────────

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
          className="text-brand-muted hover:text-white transition-colors text-sm"
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

      {/* Expanded details panel */}
      {expanded && (
        <div className="mt-1 bg-brand-slate-deep/80 border border-brand-red/20 rounded-xl px-3 py-2.5 space-y-1.5 text-[11px]">
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
          r/{post.subreddit} · 💬 {post.numComments} · {timeAgo(post.createdAt)}
        </p>
      </div>
    </a>
  );
}

function TrendsSection({
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
          {/* Reddit top posts */}
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
            <p className="text-xs text-brand-muted mt-2">
              r/CryptoCurrency · r/Bitcoin · top posts today
            </p>
          </div>

          {/* Trending on CoinGecko */}
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
            <p className="text-xs text-brand-muted mt-3">
              Source: CoinGecko · click any coin for details
            </p>
          </div>

          {/* Fear & Greed */}
          <FearGreedCard fearGreed={trends?.fearGreed ?? null} />
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, logout } = useAuthContext();
  const { data, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  // Local feedback state — optimistic updates, seeded from server on load
  const [localFeedback, setLocalFeedback] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (data?.userFeedback) setLocalFeedback(data.userFeedback);
  }, [data?.userFeedback]);

  const getFb = (type: string, id: string) => localFeedback[`${type}:${id}`];

  const handleFeedback = useCallback(
    (type: string, id: string, value: string) => {
      const key = `${type}:${id}`;
      const current = localFeedback[key];
      const nextValue = current === value ? null : value; // toggle off if same

      // Optimistic update
      setLocalFeedback((prev) => {
        const next = { ...prev };
        if (nextValue) next[key] = nextValue;
        else delete next[key];
        return next;
      });

      // Fire and forget — revert on error
      submitFeedbackApi(type, id, nextValue).catch(() => {
        setLocalFeedback((prev) => {
          const next = { ...prev };
          if (current) next[key] = current;
          else delete next[key];
          return next;
        });
      });
    },
    [localFeedback],
  );

  // Which sections to show based on user's preferred content quiz answer
  const prefs = data?.profile.preferredContent ?? [];
  const noFilter = prefs.length === 0;
  const showPrices = noFilter || prefs.includes("Price Charts & Analysis");
  const showInsight = noFilter || prefs.includes("AI Insights");
  const showNews = noFilter || prefs.includes("Market News");
  const showMeme = noFilter || prefs.includes("Crypto Memes & Fun Content");
  const showTrends = noFilter || prefs.includes("Social Trends & Sentiment");

  return (
    <div className="min-h-screen bg-brand-slate-dark text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-brand-slate border-b border-brand-border px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-black text-sm shadow">
            M
          </div>
          <span className="font-bold tracking-wide">AI Crypto Advisor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-muted hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-lg hover:bg-brand-slate-light text-brand-muted hover:text-white transition-colors"
            title="Edit Preferences"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-lg hover:bg-brand-slate-light text-brand-muted hover:text-white transition-colors"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <Button variant="secondary" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-4 text-brand-red-light text-sm">
            {error}
          </div>
        )}

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}{" "}
            <span className="text-brand-muted text-2xl">👋</span>
          </h1>
          <p className="text-brand-muted mt-1">
            Here's your personalized crypto overview for today
          </p>
        </div>

        {/* Investor Profile */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-3">
            Your Investor Profile
          </p>
          {isLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-36" />
              ))}
            </div>
          ) : data?.profile ? (
            <div className="flex flex-wrap gap-2">
              <Badge label="Type" value={data.profile.investorType} />
              <Badge label="Risk" value={data.profile.riskTolerance} />
              <Badge label="Experience" value={data.profile.experienceLevel} />
              <Badge label="Goal" value={data.profile.investmentGoal} />
            </div>
          ) : null}
        </div>

        {/* Prices + AI Insight — side by side when both visible */}
        {(showPrices || showInsight) && (
          <div
            className={`grid gap-6 ${showPrices && showInsight ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {showPrices && (
              <div className="bg-brand-slate rounded-xl border border-brand-border p-6">
                <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-5">
                  Favorite Coins · Price Charts
                </h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : !data?.prices.length ? (
                  <p className="text-brand-muted text-sm">
                    No price data available.
                  </p>
                ) : (
                  <div>
                    {data.prices.map((coin) => (
                      <CoinRow key={coin.symbol} coin={coin} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {showInsight && (
              <InsightCard
                insight={data?.insight}
                insightId={data?.insightId}
                favoriteAssets={data?.profile.favoriteAssets ?? []}
                isLoading={isLoading}
                feedback={
                  data?.insightId ? getFb("insight", data.insightId) : undefined
                }
                onFeedback={(v) =>
                  data?.insightId &&
                  handleFeedback("insight", data.insightId, v)
                }
              />
            )}
          </div>
        )}

        {/* Market News */}
        {showNews && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-5">
              Personalized Market News
              <span className="ml-2 text-brand-muted/50 normal-case tracking-normal font-normal">
                · ★ star articles to receive similar news
              </span>
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : !data?.news.length ? (
              <p className="text-brand-muted text-sm">
                No news available right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.news.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    starred={getFb("news", String(item.id)) === "star"}
                    onStar={() =>
                      handleFeedback("news", String(item.id), "star")
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Crypto Meme of the Day */}
        {showMeme && (
          <MemeCard
            meme={data?.meme}
            isLoading={isLoading}
            feedback={data?.meme ? getFb("meme", data.meme.id) : undefined}
            onFeedback={(v) =>
              data?.meme && handleFeedback("meme", data.meme.id, v)
            }
          />
        )}

        {/* Social Trends & Sentiment */}
        {showTrends && (
          <TrendsSection trends={data?.trends} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
