export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-brand-border/30 animate-pulse rounded-lg ${className}`}
    />
  );
}

export function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-brand-slate-deep border border-brand-border rounded-full px-3 py-1.5">
      <span className="text-brand-muted text-xs uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className="text-white text-xs font-semibold">{value}</span>
    </div>
  );
}
