import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser, AuthState } from "../types/auth.types";
import {
  storeToken,
  storeUser,
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  storeOnboardingStatus,
  getStoredOnboardingStatus,
} from "../utils/auth.utils";

interface AuthContextValue extends AuthState {
  login: (user: AuthUser, token: string, hasCompletedOnboarding: boolean) => void;
  logout: () => void;
  setOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    hasCompletedOnboarding: false,
  });

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser<AuthUser>();
    const hasCompletedOnboarding = getStoredOnboardingStatus();
    if (token && user) {
      setState({ user, token, isAuthenticated: true, isLoading: false, hasCompletedOnboarding });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  function login(user: AuthUser, token: string, hasCompletedOnboarding: boolean): void {
    storeToken(token);
    storeUser(user);
    storeOnboardingStatus(hasCompletedOnboarding);
    setState({ user, token, isAuthenticated: true, isLoading: false, hasCompletedOnboarding });
  }

  function logout(): void {
    clearAuthStorage();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,
    });
  }

  function setOnboardingComplete(): void {
    storeOnboardingStatus(true);
    setState((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setOnboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
}
