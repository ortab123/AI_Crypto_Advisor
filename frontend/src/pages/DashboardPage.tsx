import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { useDashboard } from "../hooks/useDashboard";
import { CoinPrice, NewsItem, MemeItem } from "../types/dashboard.types";
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

function CoinRow({ coin }: { coin: CoinPrice }) {
  const up = coin.change24h >= 0;
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-brand-border/60 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-xs font-black text-white">
          {coin.symbol.slice(0, 3)}
        </div>
        <div>
          <p className="font-bold text-sm text-white">{coin.symbol}</p>
          <p className="text-xs text-brand-muted">{coin.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">{formatPrice(coin.price)}</p>
        <p
          className={`text-xs font-semibold mt-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}
        >
          {up ? "▲" : "▼"} {Math.abs(coin.change24h).toFixed(2)}%
        </p>
      </div>
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
  return (
    <div className="group relative flex flex-col justify-between bg-brand-slate border border-brand-border rounded-xl p-4 hover:border-brand-red/50 hover:bg-brand-slate-light transition-all duration-200">
      {/* Star button */}
      <button
        onClick={onStar}
        title={starred ? "Remove from favorites" : "Save — get similar news"}
        className={`absolute top-3 right-3 text-lg transition-transform hover:scale-125 ${
          starred ? "text-yellow-400" : "text-brand-muted hover:text-yellow-300"
        }`}
      >
        {starred ? "★" : "☆"}
      </button>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pr-7"
      >
        <p className="text-sm text-white/90 font-medium leading-snug line-clamp-3 group-hover:text-white">
          {item.title}
        </p>
      </a>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs bg-brand-red/10 text-brand-red-light border border-brand-red/20 px-2 py-0.5 rounded-full font-medium">
          {item.source}
        </span>
        <span className="text-xs text-brand-muted">
          {timeAgo(item.publishedAt)}
        </span>
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
      </main>
    </div>
  );
}
