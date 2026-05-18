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
      <button
        onClick={onStar}
        title={starred ? "Remove from favorites" : "Save — get similar news"}
        className={`absolute top-3 right-3 z-10 text-lg transition-transform hover:scale-125 ${
          starred ? "text-yellow-400" : "text-brand-muted hover:text-yellow-300"
        }`}
      >
        {starred ? "★" : "☆"}
      </button>

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
