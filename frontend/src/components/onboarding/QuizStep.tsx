import { ReactNode } from "react";
import { Button } from "../common/Button";

interface QuizStepProps {
  label: string;
  question: string;
  children: ReactNode;
  step: number;
  totalSteps: number;
  isLastStep: boolean;
  isValid: boolean;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function QuizStep({
  label,
  question,
  children,
  step,
  totalSteps,
  isLastStep,
  isValid,
  isLoading,
  onNext,
  onBack,
  onSubmit,
}: QuizStepProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-brand-muted mb-2">
          <span>
            Step {step + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-brand-slate-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <p className="text-xs font-semibold text-brand-red-light uppercase tracking-wider mb-1">
          {label}
        </p>
        <h3 className="text-lg font-bold text-white">{question}</h3>
      </div>

      {/* Options */}
      <div>{children}</div>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        {isLastStep ? (
          <Button
            className="flex-1"
            isLoading={isLoading}
            disabled={!isValid}
            onClick={onSubmit}
          >
            Finish
          </Button>
        ) : (
          <Button className="flex-1" disabled={!isValid} onClick={onNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
