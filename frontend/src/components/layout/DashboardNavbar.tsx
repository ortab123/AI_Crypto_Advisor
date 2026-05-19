import { Button } from "../common/Button";

interface DashboardNavbarProps {
  email: string;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function DashboardNavbar({
  email,
  onProfile,
  onSettings,
  onLogout,
}: DashboardNavbarProps) {
  return (
    <nav className="sticky top-0 z-10 bg-brand-slate border-b border-brand-border px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-black text-sm shadow">
          M
        </div>
        <span className="font-bold tracking-wide">AI Crypto Advisor</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-muted hidden sm:block">{email}</span>
        <button
          onClick={onProfile}
          className="p-2 rounded-lg hover:bg-brand-slate-light text-brand-muted hover:text-white transition-colors"
          title="Edit Preferences"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
        <button
          onClick={onSettings}
          className="p-2 rounded-lg hover:bg-brand-slate-light text-brand-muted hover:text-white transition-colors"
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <Button variant="secondary" onClick={onLogout}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
