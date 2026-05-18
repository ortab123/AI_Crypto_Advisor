import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <span className="text-2xl">₿</span>
          </div>
          <h1 className="text-xl font-bold text-white">AI Crypto Advisor</h1>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
