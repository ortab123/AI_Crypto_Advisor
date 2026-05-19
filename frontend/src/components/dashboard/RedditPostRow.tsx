import { RedditPost } from "../../types/dashboard.types";
import { timeAgo } from "./utils";

export function RedditPostRow({
  post,
  feedback,
  onFeedback,
}: {
  post: RedditPost;
  feedback?: string;
  onFeedback?: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-brand-border/50 last:border-0">
      {/* Reddit score */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 w-10 text-center">
        <span className="text-brand-muted text-xs">▲</span>
        <span className="text-xs font-bold text-white">
          {post.score >= 1000
            ? `${(post.score / 1000).toFixed(1)}k`
            : post.score}
        </span>
      </div>

      {/* Post content */}
      <div className="min-w-0 flex-1">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-white/90 leading-snug line-clamp-2 hover:text-white hover:underline block"
        >
          {post.title}
        </a>
        <p className="text-xs text-brand-muted mt-1">
          💬 {post.numComments} · {timeAgo(post.createdAt)}
        </p>
        {/* Like / Dislike */}
        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={() => onFeedback?.("like")}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border transition-colors ${
              feedback === "like"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "border-brand-border/60 text-brand-muted hover:text-emerald-400 hover:border-emerald-500/40"
            }`}
          >
            👍
          </button>
          <button
            onClick={() => onFeedback?.("dislike")}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border transition-colors ${
              feedback === "dislike"
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "border-brand-border/60 text-brand-muted hover:text-red-400 hover:border-red-500/40"
            }`}
          >
            👎
          </button>
        </div>
      </div>
    </div>
  );
}
