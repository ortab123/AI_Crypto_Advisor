import { AuthLayout } from '../components/layout/AuthLayout';
import { QuizStep } from '../components/onboarding/QuizStep';
import { MultiChoiceQuestion } from '../components/onboarding/MultiChoiceQuestion';
import { SingleChoiceQuestion } from '../components/onboarding/SingleChoiceQuestion';
import { FormError } from '../components/common/FormError';
import { useOnboarding } from '../hooks/useOnboarding';
import { QuizAnswers } from '../types/onboarding.types';

export function OnboardingPage() {
  const {
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
    totalSteps,
  } = useOnboarding();

  return (
    <AuthLayout
      title="Let's personalize your experience"
      subtitle="Answer a few quick questions to tailor your dashboard"
    >
      <FormError message={apiError} />
      <QuizStep
        label={currentQuestion.label}
        question={currentQuestion.question}
        step={step}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        isValid={isCurrentStepValid()}
        isLoading={isLoading}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
      >
        {currentQuestion.type === 'multi' ? (
          <MultiChoiceQuestion
            options={currentQuestion.options}
            selected={answers.favoriteAssets}
            customAsset={answers.customAsset}
            onToggle={handleMultiToggle}
            onCustomAsset={handleCustomAsset}
          />
        ) : (
          <SingleChoiceQuestion
            options={currentQuestion.options}
            selected={answers[currentQuestion.key as keyof QuizAnswers] as string}
            onSelect={(val) =>
              handleSingleSelect(currentQuestion.key as keyof QuizAnswers, val)
            }
          />
        )}
      </QuizStep>
    </AuthLayout>
  );
}
