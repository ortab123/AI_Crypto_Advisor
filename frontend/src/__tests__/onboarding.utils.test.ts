/**
 * Onboarding Utils Tests
 * Topics: Onboarding Flow (pure logic), buildFinalAnswers, isStepValid
 */
import {
  buildFinalAnswers,
  isStepValid,
  EMPTY_ANSWERS,
} from "../utils/onboarding.utils";
import { QuizAnswers } from "../types/onboarding.types";

const base: QuizAnswers = {
  ...EMPTY_ANSWERS,
  investorType: "Long-term investor",
  experienceLevel: "Intermediate",
  riskTolerance: "Medium",
  investmentGoal: "Wealth accumulation",
  preferredContent: ["Price Charts & Analysis"],
};

// ── buildFinalAnswers ────────────────────────────────────────────────────────
describe("buildFinalAnswers", () => {
  test("merges comma-separated customAsset into favoriteAssets", () => {
    const answers = {
      ...base,
      favoriteAssets: ["Bitcoin (BTC)", "Other..."],
      customAsset: "SOL, ADA",
    };
    const result = buildFinalAnswers(answers);
    expect(result.favoriteAssets).toContain("SOL");
    expect(result.favoriteAssets).toContain("ADA");
    expect(result.favoriteAssets).not.toContain("Other...");
  });

  test("deduplicates coins case-insensitively", () => {
    const answers = {
      ...base,
      favoriteAssets: ["Bitcoin (BTC)", "Other..."],
      customAsset: "bitcoin (btc), ETH",
    };
    const result = buildFinalAnswers(answers);
    const lower = result.favoriteAssets.map((c) => c.toLowerCase());
    const bitcoinCount = lower.filter((c) => c === "bitcoin (btc)").length;
    expect(bitcoinCount).toBe(1);
  });

  test("enforces 3-coin maximum for custom entries", () => {
    const answers = {
      ...base,
      favoriteAssets: ["Other..."],
      customAsset: "SOL, ADA, DOT, LINK, AVAX",
    };
    const result = buildFinalAnswers(answers);
    expect(result.favoriteAssets.length).toBeLessThanOrEqual(3);
  });

  test("does not add customAsset coins when Other... is not selected", () => {
    const answers = {
      ...base,
      favoriteAssets: ["Bitcoin (BTC)"],
      customAsset: "SOL, ADA",
    };
    const result = buildFinalAnswers(answers);
    expect(result.favoriteAssets).not.toContain("SOL");
    expect(result.favoriteAssets).toEqual(["Bitcoin (BTC)"]);
  });
});

// ── isStepValid ──────────────────────────────────────────────────────────────
describe("isStepValid", () => {
  test("multi type with selected values returns true", () => {
    const answers = { ...base, preferredContent: ["Price Charts & Analysis"] };
    expect(isStepValid("preferredContent", "multi", answers)).toBe(true);
  });

  test("multi type with empty array returns false", () => {
    const answers = { ...base, preferredContent: [] };
    expect(isStepValid("preferredContent", "multi", answers)).toBe(false);
  });

  test("favoriteAssets with only Other... and no customAsset returns false", () => {
    const answers = { ...base, favoriteAssets: ["Other..."], customAsset: "" };
    expect(isStepValid("favoriteAssets", "multi", answers)).toBe(false);
  });

  test("favoriteAssets with Other... and a custom coin returns true", () => {
    const answers = {
      ...base,
      favoriteAssets: ["Other..."],
      customAsset: "SOL",
    };
    expect(isStepValid("favoriteAssets", "multi", answers)).toBe(true);
  });

  test("single type with a value returns true", () => {
    const answers = { ...base, investorType: "Day trader" };
    expect(isStepValid("investorType", "single", answers)).toBe(true);
  });

  test("single type with empty string returns false", () => {
    const answers = { ...base, investorType: "" };
    expect(isStepValid("investorType", "single", answers)).toBe(false);
  });
});
