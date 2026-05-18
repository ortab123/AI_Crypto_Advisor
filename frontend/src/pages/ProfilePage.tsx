import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { QuizStep } from "../components/onboarding/QuizStep";
import { MultiChoiceQuestion } from "../components/onboarding/MultiChoiceQuestion";
import { SingleChoiceQuestion } from "../components/onboarding/SingleChoiceQuestion";
import { FormError } from "../components/common/FormError";
import { Button } from "../components/common/Button";
import { useProfile } from "../hooks/useProfile";
import { QuizAnswers } from "../types/onboarding.types";

export function ProfilePage() {
  const navigate = useNavigate();
  const {
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
    totalSteps,
  } = useProfile();

  if (isLoadingPrefs) {
    return (
      <div className="min-h-screen bg-brand-slate-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-brand-slate-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </div>
          <p className="text-white font-bold text-lg">Preferences saved!</p>
          <p className="text-brand-muted text-sm mt-1">
            Returning to dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Edit Your Preferences"
      subtitle="Update your profile to retune your dashboard"
    >
      <div className="mb-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard")}
          className="text-xs px-3 py-1.5"
        >
          ← Back to Dashboard
        </Button>
      </div>
      <FormError message={apiError} />
      <QuizStep
        label={currentQuestion.label}
        question={currentQuestion.question}
        step={step}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        isValid={isCurrentStepValid()}
        isLoading={isSubmitting}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
      >
        {currentQuestion.type === "multi" ? (
          <MultiChoiceQuestion
            options={currentQuestion.options}
            selected={
              answers[currentQuestion.key as keyof QuizAnswers] as string[]
            }
            customAsset={answers.customAsset}
            onToggle={handleMultiToggle}
            onCustomAsset={handleCustomAsset}
          />
        ) : (
          <SingleChoiceQuestion
            options={currentQuestion.options}
            selected={
              answers[currentQuestion.key as keyof QuizAnswers] as string
            }
            onSelect={(val) =>
              handleSingleSelect(currentQuestion.key as keyof QuizAnswers, val)
            }
          />
        )}
      </QuizStep>
    </AuthLayout>
  );
}
