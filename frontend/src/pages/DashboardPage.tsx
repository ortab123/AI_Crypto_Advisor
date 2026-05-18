import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { useDashboard } from "../hooks/useDashboard";
import { submitFeedbackApi } from "../services/dashboard.service";
import { Skeleton, Badge } from "../components/dashboard/Skeleton";
import { CoinRow } from "../components/dashboard/CoinRow";
import { NewsCard } from "../components/dashboard/NewsCard";
import { InsightCard } from "../components/dashboard/InsightCard";
import { MemeCard } from "../components/dashboard/MemeCard";
import { TrendsSection } from "../components/dashboard/TrendsSection";

export function DashboardPage() {
  const { user, logout } = useAuthContext();
  const { data, isLoading, error } = useDashboard();
  const navigate = useNavigate();

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
      const nextValue = current === value ? null : value;

      setLocalFeedback((prev) => {
        const next = { ...prev };
        if (nextValue) next[key] = nextValue;
        else delete next[key];
        return next;
      });

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

        {/* Prices + AI Insight */}
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
