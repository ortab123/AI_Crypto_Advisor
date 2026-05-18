import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { submitOnboardingApi } from '../services/onboarding.service';
import { QuizAnswers } from '../types/onboarding.types';
import { QUIZ_QUESTIONS } from '../config/quiz.config';

const INITIAL_ANSWERS: QuizAnswers = {
  favoriteAssets: [],
  customAsset: '',
  investorType: '',
  experienceLevel: '',
  riskTolerance: '',
  investmentGoal: '',
};

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
    if (currentQuestion.key === 'favoriteAssets') {
      return answers.favoriteAssets.length > 0;
    }
    const value = answers[currentQuestion.key as keyof QuizAnswers];
    return typeof value === 'string' && value.length > 0;
  }

  function handleMultiToggle(option: string): void {
    setAnswers((prev) => {
      const assets = prev.favoriteAssets.includes(option)
        ? prev.favoriteAssets.filter((a) => a !== option)
        : [...prev.favoriteAssets, option];
      const customAsset =
        option === 'Other...' && prev.favoriteAssets.includes(option) ? '' : prev.customAsset;
      return { ...prev, favoriteAssets: assets, customAsset };
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
      await submitOnboardingApi(answers);
      setOnboardingComplete();
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err))
        setApiError(err.response?.data?.message || 'Failed to save preferences.');
      else setApiError('An unexpected error occurred.');
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
