const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const ONBOARDING_KEY = 'onboarding_complete';
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeUser(user: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
}

export function storeOnboardingStatus(completed: boolean): void {
  localStorage.setItem(ONBOARDING_KEY, String(completed));
}

export function getStoredOnboardingStatus(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}
