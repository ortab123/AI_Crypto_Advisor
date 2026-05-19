import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import {
  submitOnboardingApi,
  getOnboardingApi,
} from "../services/onboarding.service";
import { QuizAnswers } from "../types/onboarding.types";
import { QUIZ_QUESTIONS } from "../config/quiz.config";
import {
  EMPTY_ANSWERS,
  buildFinalAnswers,
  isStepValid,
} from "../utils/onboarding.utils";

export function useProfile() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { setOnboardingComplete } = useAuthContext();
  const navigate = useNavigate();

  // Pre-fill with existing preferences
  useEffect(() => {
    getOnboardingApi()
      .then((prefs) => {
        if (prefs) {
          // Standard labels shown as checkboxes (everything except "Other...")
          const standardOptions = new Set(
            QUIZ_QUESTIONS[0].options.filter((o) => o !== "Other..."),
          );
          const standardSelected = prefs.favoriteAssets.filter((a) =>
            standardOptions.has(a),
          );
          // Coins that don't match any checkbox came from the "Other..." field.
          // Always reconstruct from favoriteAssets so stale customAsset in DB doesn't pollute the form.
          const nonStandard = prefs.favoriteAssets.filter(
            (a) => !standardOptions.has(a) && a !== "Other...",
          );
          const customAsset = nonStandard.join(", ");
          // Re-add "Other..." to the selection so the text field is visible
          const favoriteAssets = customAsset
            ? [...standardSelected, "Other..."]
            : standardSelected;
          setAnswers({
            favoriteAssets,
            customAsset,
            investorType: prefs.investorType,
            experienceLevel: prefs.experienceLevel,
            riskTolerance: prefs.riskTolerance,
            investmentGoal: prefs.investmentGoal,
            preferredContent: prefs.preferredContent,
          });
        }
      })
      .finally(() => setIsLoadingPrefs(false));
  }, []);

  const currentQuestion = QUIZ_QUESTIONS[step];
  const isLastStep = step === QUIZ_QUESTIONS.length - 1;

  function isCurrentStepValid(): boolean {
    return isStepValid(currentQuestion.key, currentQuestion.type, answers);
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
    setIsSubmitting(true);
    setApiError(null);
    try {
      await submitOnboardingApi(buildFinalAnswers(answers));
      setOnboardingComplete();
      setSaved(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      if (axios.isAxiosError(err))
        setApiError(
          err.response?.data?.message || "Failed to save preferences.",
        );
      else setApiError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    step,
    answers,
    isLoadingPrefs,
    isSubmitting,
    apiError,
    saved,
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
