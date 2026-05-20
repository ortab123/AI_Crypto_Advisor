import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import {
  submitFeedbackApi,
  submitNewsVoteApi,
  submitCoinVoteApi,
  submitInsightVoteApi,
  submitMemeVoteApi,
  submitRedditVoteApi,
} from "../services/dashboard.service";
import { Skeleton, Badge } from "../components/dashboard/Skeleton";
import { CoinRow } from "../components/dashboard/CoinRow";
import { NewsCard } from "../components/dashboard/NewsCard";
import { InsightCard } from "../components/dashboard/InsightCard";
import { MemeCard } from "../components/dashboard/MemeCard";
import { TrendsSection } from "../components/dashboard/TrendsSection";
import { DashboardNavbar } from "../components/layout/DashboardNavbar";

export function DashboardPage() {
  const { user, logout } = useAuthContext();
  const { data, isLoading, error, refetch } = useDashboard();
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

  const volatilityLevel = (change24h: number) => {
    const abs = Math.abs(change24h);
    if (abs < 2) return "low";
    if (abs < 5) return "medium";
    return "high";
  };

  const prefs = data?.profile.preferredContent ?? [];
  const noFilter = prefs.length === 0;
  const showPrices = noFilter || prefs.includes("Price Charts & Analysis");
  const showInsight = noFilter || prefs.includes("AI Insights");
  const showNews = noFilter || prefs.includes("Market News");
  const showMeme = noFilter || prefs.includes("Crypto Memes & Fun Content");
  const showTrends = noFilter || prefs.includes("Social Trends & Sentiment");

  return (
    <div className="min-h-screen bg-brand-slate-dark text-white">
      <DashboardNavbar
        email={user?.email ?? ""}
        onProfile={() => navigate("/profile")}
        onSettings={() => navigate("/settings")}
        onLogout={logout}
      />

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
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    {(data?.profile.favoriteAssets.length ?? 0) > 0 ? (
                      <>
                        <p className="text-brand-muted text-sm">
                          Price data temporarily unavailable.
                        </p>
                        <button
                          onClick={refetch}
                          className="text-xs text-brand-red-light hover:text-white border border-brand-red/40 hover:border-brand-red px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Retry
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-brand-muted text-sm">
                          No coins selected yet.
                        </p>
                        <button
                          onClick={() => navigate("/profile")}
                          className="text-xs text-brand-red-light hover:text-white border border-brand-red/40 hover:border-brand-red px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit preferences
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                    {data.prices.map((coin) => (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        feedback={getFb("coin", coin.id)}
                        onFeedback={(v) => {
                          handleFeedback("coin", coin.id, v);
                          submitCoinVoteApi({
                            coinSymbol: coin.symbol,
                            voteType: v,
                            priceTrend: coin.change24h >= 0 ? "up" : "down",
                            volatilityLevel: volatilityLevel(coin.change24h),
                          }).catch(() => {});
                        }}
                      />
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
                onFeedback={(v) => {
                  if (!data?.insightId) return;
                  handleFeedback("insight", data.insightId, v);
                  submitInsightVoteApi({
                    insightId: data.insightId,
                    voteType: v,
                    cryptoAssets: data.profile.favoriteAssets,
                    riskLevel: data.profile.riskTolerance,
                  }).catch(() => {});
                }}
              />
            )}
          </div>
        )}

        {/* Market News */}
        {showNews && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-5">
              Market News
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
                    onStar={() => {
                      handleFeedback("news", String(item.id), "star");
                      const isCurrentlyStarred = getFb("news", String(item.id)) === "star";
                      submitNewsVoteApi({
                        voteType: isCurrentlyStarred ? "unstarred" : "starred",
                        cryptoAssets: data.profile.favoriteAssets,
                        articleUrl: item.url,
                        source: item.source,
                      }).catch(() => {});
                    }}
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
            onFeedback={(v) => {
              if (!data?.meme) return;
              handleFeedback("meme", data.meme.id, v);
              submitMemeVoteApi({
                memeId: data.meme.id,
                reactionType: v,
                cryptoAssets: data.profile.favoriteAssets,
              }).catch(() => {});
            }}
          />
        )}

        {/* Social Trends & Sentiment */}
        {showTrends && (
          <TrendsSection
            trends={data?.trends}
            isLoading={isLoading}
            getFeedback={getFb}
            onFeedback={(type, id, value) => {
              handleFeedback(type, id, value);
              if (type === "reddit") {
                const post = data?.trends?.reddit.find((p) => p.id === id);
                submitRedditVoteApi({
                  postId: id,
                  voteType: value,
                  cryptoAssets: data?.profile.favoriteAssets ?? [],
                  postTopic: post?.subreddit,
                }).catch(() => {});
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
