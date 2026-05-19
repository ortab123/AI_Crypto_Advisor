/**
 * Auth Utils Tests
 * Topics: Refresh / Persistence Testing — localStorage read/write/clear
 */
import {
  storeToken,
  getStoredToken,
  storeUser,
  getStoredUser,
  clearAuthStorage,
  storeOnboardingStatus,
  getStoredOnboardingStatus,
} from "../utils/auth.utils";

beforeEach(() => localStorage.clear());

describe("Auth Utils — localStorage persistence", () => {
  test("storeToken / getStoredToken roundtrip", () => {
    storeToken("my-jwt-token");
    expect(getStoredToken()).toBe("my-jwt-token");
  });

  test("storeUser / getStoredUser roundtrip preserves object shape", () => {
    const user = { id: "1", email: "test@example.com", name: "Alice" };
    storeUser(user);
    expect(getStoredUser()).toEqual(user);
  });

  test("clearAuthStorage removes token, user and onboarding flag", () => {
    storeToken("tok");
    storeUser({ id: "1" });
    storeOnboardingStatus(true);

    clearAuthStorage();

    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
    expect(getStoredOnboardingStatus()).toBe(false);
  });

  test("getStoredOnboardingStatus returns false when not set, true when set", () => {
    expect(getStoredOnboardingStatus()).toBe(false);
    storeOnboardingStatus(true);
    expect(getStoredOnboardingStatus()).toBe(true);
  });
});
