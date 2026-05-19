import { TrendsData } from "../../types/dashboard.types";
import { Skeleton } from "./Skeleton";
import { FearGreedCard } from "./FearGreedCard";
import { TrendingCoinChip } from "./TrendingCoinChip";
import { RedditPostRow } from "./RedditPostRow";

export function TrendsSection({
  trends,
  isLoading,
  getFeedback,
  onFeedback,
}: {
  trends: TrendsData | null | undefined;
  isLoading: boolean;
  getFeedback: (type: string, id: string) => string | undefined;
  onFeedback: (type: string, id: string, value: string) => void;
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
                  <RedditPostRow
                    key={post.id}
                    post={post}
                    feedback={getFeedback("reddit", post.id)}
                    onFeedback={(v) => onFeedback("reddit", post.id, v)}
                  />
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
