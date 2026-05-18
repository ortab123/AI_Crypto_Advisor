import { Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthContext } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } =
    useAuthContext();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } =
    useAuthContext();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (hasCompletedOnboarding) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function LoggedInRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } =
    useAuthContext();
  if (isLoading) return null;
  if (isAuthenticated) {
    return (
      <Navigate
        to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <LoggedInRoute>
            <ProfilePage />
          </LoggedInRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <LoggedInRoute>
            <SettingsPage />
          </LoggedInRoute>
        }
      />
    </Routes>
  );
}
