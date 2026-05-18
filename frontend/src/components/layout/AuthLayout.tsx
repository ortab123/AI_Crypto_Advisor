import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-slate-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-red/15 border border-brand-red/40 mb-4">
            <span className="text-2xl font-black text-white tracking-tighter">
              M
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            AI Crypto Advisor
          </h1>
          <p className="text-xs text-brand-muted mt-1 tracking-widest uppercase">
            by Moveo Group
          </p>
        </div>
        <div className="bg-brand-slate rounded-2xl border border-brand-border p-8 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-brand-muted text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
