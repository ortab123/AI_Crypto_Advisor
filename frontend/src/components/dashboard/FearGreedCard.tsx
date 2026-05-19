import { useState } from "react";

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

export function FearGreedCard({
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
          className="text-brand-muted hover:text-white transition-colors text-lg font-bold"
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
