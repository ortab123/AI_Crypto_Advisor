/**
 * AuthContext Tests
 * Topics: Authentication Flow, Refresh / Persistence Testing
 */
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "../context/AuthContext";

const mockUser = { id: "user-1", email: "test@example.com", name: "Alice" };

beforeEach(() => localStorage.clear());

describe("AuthContext", () => {
  test("initial state is unauthenticated and finishes loading", async () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    // After hydration effect runs
    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  test("login() updates state and persists to localStorage", async () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });
    await act(async () => {});

    act(() => {
      result.current.login(mockUser, "test-token-abc", false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("test-token-abc");
    expect(localStorage.getItem("auth_token")).toBe("test-token-abc");
  });

  test("logout() clears state and removes all localStorage keys", async () => {
    // Seed localStorage to simulate a prior session
    localStorage.setItem("auth_token", "old-token");
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
    localStorage.setItem("onboarding_complete", "true");

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });
    await act(async () => {}); // hydrate from storage

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  test("hydrates authentication state from localStorage on mount", async () => {
    localStorage.setItem("auth_token", "stored-token");
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
    localStorage.setItem("onboarding_complete", "true");

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });
    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.hasCompletedOnboarding).toBe(true);
    expect(result.current.user?.email).toBe("test@example.com");
  });
});
