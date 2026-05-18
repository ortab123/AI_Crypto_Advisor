import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";

export function DashboardPage() {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">₿</span>
          <span className="font-bold">AI Crypto Advisor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
          <Button variant="secondary" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
        <p className="text-gray-400">
          Coming soon — AI-curated crypto content tailored just for you.
        </p>
      </main>
    </div>
  );
}
