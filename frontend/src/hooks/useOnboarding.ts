import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { submitOnboardingApi } from "../services/onboarding.service";
import { QuizAnswers } from "../types/onboarding.types";
import { QUIZ_QUESTIONS } from "../config/quiz.config";

const INITIAL_ANSWERS: QuizAnswers = {
  favoriteAssets: [],
  customAsset: "",
  investorType: "",
  experienceLevel: "",
  riskTolerance: "",
  investmentGoal: "",
  preferredContent: [],
};

/** Merge comma-separated customAsset entries into favoriteAssets before submitting. */
function buildFinalAnswers(answers: QuizAnswers): QuizAnswers {
  const hasOther = answers.favoriteAssets.includes("Other...");
  const customCoins = hasOther
    ? answers.customAsset
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];
  // Merge preset choices (excluding "Other...") with typed custom coins, dedup case-insensitively
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

export function useOnboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setOnboardingComplete } = useAuthContext();
  const navigate = useNavigate();

  const currentQuestion = QUIZ_QUESTIONS[step];
  const isLastStep = step === QUIZ_QUESTIONS.length - 1;

  function isCurrentStepValid(): boolean {
    if (currentQuestion.type === "multi") {
      const value = answers[currentQuestion.key as keyof QuizAnswers];
      if (!Array.isArray(value) || value.length === 0) return false;
      if (currentQuestion.key === "favoriteAssets") {
        const hasRealCoin = (value as string[]).some((v) => v !== "Other...");
        const hasCustom =
          (value as string[]).includes("Other...") &&
          answers.customAsset.trim().length > 0;
        return hasRealCoin || hasCustom;
      }
      return true;
    }
    const value = answers[currentQuestion.key as keyof QuizAnswers];
    return typeof value === "string" && value.length > 0;
  }

  function handleMultiToggle(option: string): void {
    const key = currentQuestion.key as "favoriteAssets" | "preferredContent";
    setAnswers((prev) => {
      const current = prev[key] as string[];
      const updated = current.includes(option)
        ? current.filter((a) => a !== option)
        : [...current, option];
      const customAsset =
        key === "favoriteAssets" &&
        option === "Other..." &&
        current.includes(option)
          ? ""
          : prev.customAsset;
      return { ...prev, [key]: updated, customAsset };
    });
  }

  function handleSingleSelect(key: keyof QuizAnswers, value: string): void {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleCustomAsset(value: string): void {
    setAnswers((prev) => ({ ...prev, customAsset: value }));
  }

  function handleNext(): void {
    if (!isCurrentStepValid()) return;
    setStep((prev) => prev + 1);
  }

  function handleBack(): void {
    setStep((prev) => prev - 1);
  }

  async function handleSubmit(): Promise<void> {
    if (!isCurrentStepValid()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      await submitOnboardingApi(buildFinalAnswers(answers));
      setOnboardingComplete();
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err))
        setApiError(
          err.response?.data?.message || "Failed to save preferences.",
        );
      else setApiError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    step,
    answers,
    isLoading,
    apiError,
    currentQuestion,
    isLastStep,
    isCurrentStepValid,
    handleMultiToggle,
    handleSingleSelect,
    handleCustomAsset,
    handleNext,
    handleBack,
    handleSubmit,
    totalSteps: QUIZ_QUESTIONS.length,
  };
}
