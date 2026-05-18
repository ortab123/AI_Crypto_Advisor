import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthState } from '../types/auth.types';
import { storeToken, storeUser, clearAuthStorage, getStoredToken, getStoredUser } from '../utils/auth.utils';

interface AuthContextValue extends AuthState {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser<AuthUser>();
    if (token && user) {
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  function login(user: AuthUser, token: string): void {
    storeToken(token);
    storeUser(user);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }

  function logout(): void {
    clearAuthStorage();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
}
