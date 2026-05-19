import { QuizAnswers } from "../types/onboarding.types";

export const EMPTY_ANSWERS: QuizAnswers = {
  favoriteAssets: [],
  customAsset: "",
  investorType: "",
  experienceLevel: "",
  riskTolerance: "",
  investmentGoal: "",
  preferredContent: [],
};

/**
 * Merges comma-separated customAsset entries into favoriteAssets before
 * submitting. Deduplicates case-insensitively and enforces a 3-coin max.
 */
export function buildFinalAnswers(answers: QuizAnswers): QuizAnswers {
  const hasOther = answers.favoriteAssets.includes("Other...");
  const customCoins = hasOther
    ? answers.customAsset
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const seen = new Set<string>();
  const merged: string[] = [];
  for (const coin of [
    ...answers.favoriteAssets.filter((a) => a !== "Other..."),
    ...customCoins,
  ]) {
    const key = coin.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(coin);
    }
  }

  return {
    ...answers,
    favoriteAssets: merged,
    customAsset: hasOther ? answers.customAsset : "",
  };
}

/**
 * Returns true when the current quiz step has a valid answer.
 * For favoriteAssets: requires at least one real coin OR a non-empty custom field.
 */
export function isStepValid(
  questionKey: string,
  questionType: "multi" | "single",
  answers: QuizAnswers,
): boolean {
  if (questionType === "multi") {
    const value = answers[questionKey as keyof QuizAnswers];
    if (!Array.isArray(value) || value.length === 0) return false;
    if (questionKey === "favoriteAssets") {
      const hasRealCoin = (value as string[]).some((v) => v !== "Other...");
      const hasCustom =
        (value as string[]).includes("Other...") &&
        answers.customAsset.trim().length > 0;
      return hasRealCoin || hasCustom;
    }
    return true;
  }
  const value = answers[questionKey as keyof QuizAnswers];
  return typeof value === "string" && value.length > 0;
}
