import { type ProgressProps } from "../../lib/types/snack-form.types";

export function SnackFormProgress({ currentStep, totalSteps, onStepClick }: ProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                step === currentStep
                  ? "bg-blue-200 text-black"
                  : step < currentStep
                    ? "bg-blue-200/20 text-blue-200 border-2 border-blue-200/50"
                    : "bg-white/10 text-blue-100/60 border-2 border-white/20"
              } ${onStepClick ? "cursor-pointer hover:bg-blue-200/30" : "cursor-default"}`}
              onClick={() => onStepClick?.(step)}
              disabled={!onStepClick}
              aria-current={step === currentStep ? "step" : undefined}
            >
              {step}
            </button>
            <div
              className={`h-1 w-16 mt-4 rounded ${step < currentStep ? "bg-blue-200" : "bg-white/20"}`}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-blue-100/70">
          Krok {currentStep} z {totalSteps}
        </p>
      </div>
    </div>
  );
}
