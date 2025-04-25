import { type ProgressProps } from "../../lib/types/snack-form.types";

export function SnackFormProgress({ currentStep, totalSteps, onStepClick }: ProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              } ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => onStepClick?.(step)}
              disabled={!onStepClick}
              aria-current={step === currentStep ? "step" : undefined}
            >
              {step}
            </button>
            <div className={`h-1 w-16 mt-4 ${step < currentStep ? "bg-primary" : "bg-muted"}`} aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Krok {currentStep} z {totalSteps}
        </p>
      </div>
    </div>
  );
}
