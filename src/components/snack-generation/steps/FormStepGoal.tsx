import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import type { Goal } from "../../../types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface GoalOption {
  value: Goal;
  label: string;
  description: string;
  icon: string;
}

const goalOptions: GoalOption[] = [
  {
    value: "utrzymanie",
    label: "Utrzymanie wagi",
    description: "Przekąska zbilansowana pod kątem kalorii i składników odżywczych",
    icon: "⚖️",
  },
  {
    value: "redukcja",
    label: "Redukcja wagi",
    description: "Przekąska niskokaloryczna, pomagająca w procesie odchudzania",
    icon: "📉",
  },
  {
    value: "przyrost",
    label: "Przyrost masy",
    description: "Przekąska kaloryczna, bogata w białko i węglowodany",
    icon: "📈",
  },
];

export function FormStepGoal({ state, dispatch, onNext, onPrev }: StepProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(state.goal);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update local state when global state changes
    setSelectedGoal(state.goal);
  }, [state.goal]);

  const handleGoalChange = (value: Goal) => {
    setSelectedGoal(value);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedGoal) {
      setError("Proszę wybrać cel dietetyczny");
      return;
    }

    dispatch({ type: "SET_GOAL", payload: selectedGoal });
    onNext();
  };

  return (
    <FormStep
      title="Jaki jest Twój cel dietetyczny?"
      description="Wybierz cel, który chcesz osiągnąć dzięki odpowiedniej diecie."
    >
      <div className="space-y-6">
        <RadioGroup
          value={selectedGoal || ""}
          onValueChange={(value) => handleGoalChange(value as Goal)}
          className="space-y-3"
        >
          {goalOptions.map((option) => (
            <button
              key={option.value}
              className={`flex items-start p-4 rounded-lg border w-full text-left transition-all ${
                selectedGoal === option.value
                  ? "border-blue-200 bg-blue-200/10 shadow-lg"
                  : "border-white/20 bg-white/5 hover:border-blue-200/50 hover:bg-white/10"
              }`}
              onClick={() => handleGoalChange(option.value)}
              type="button"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="text-2xl mt-1" aria-hidden="true">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <Label htmlFor={option.value} className="text-base font-medium cursor-pointer text-white">
                    {option.label}
                  </Label>
                  <p className="text-sm text-blue-100/70">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </RadioGroup>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={onPrev}
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all"
          >
            Wstecz
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="bg-blue-200 text-black hover:bg-blue-300 focus-visible:ring-blue-300/50"
          >
            Dalej
          </Button>
        </div>
      </div>
    </FormStep>
  );
}
