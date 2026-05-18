import { Skeleton } from "./Skeleton";

export function InsightCard({
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
