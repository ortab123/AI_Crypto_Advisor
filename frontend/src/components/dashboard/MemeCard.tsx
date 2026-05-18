import { useState } from "react";
import { MemeItem } from "../../types/dashboard.types";
import { Skeleton } from "./Skeleton";

const MEME_REACTIONS = [
  { value: "laugh", emoji: "😂", label: "Haha" },
  { value: "love", emoji: "❤️", label: "Love" },
  { value: "angry", emoji: "😡", label: "Rage" },
];

export function MemeCard({
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
        <div className="relative bg-black flex items-center justify-center max-h-[420px] overflow-hidden">
          <img
            src={meme.imageUrl!}
            alt={meme.title}
            onError={() => setImgError(true)}
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      )}

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
