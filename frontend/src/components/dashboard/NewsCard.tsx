import { useState } from "react";
import { NewsItem } from "../../types/dashboard.types";
import { timeAgo } from "./utils";

export function NewsCard({
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
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <p className="text-sm text-white/90 font-medium leading-snug line-clamp-3 group-hover:text-white">
            {item.title}
          </p>
        </a>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-brand-red/10 text-brand-red-light border border-brand-red/20 px-2 py-0.5 rounded-full font-medium">
              {item.source}
            </span>
            <span className="text-xs text-brand-muted">
              {timeAgo(item.publishedAt)}
            </span>
          </div>
          <button
            onClick={onStar}
            title={starred ? "Remove from saved" : "Save — get similar news"}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
              starred
                ? "bg-yellow-400/15 border-yellow-400/60 text-yellow-400"
                : "border-brand-border text-brand-muted hover:border-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
          >
            <span className="text-base leading-none">
              {starred ? "★" : "☆"}
            </span>
            <span>{starred ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
