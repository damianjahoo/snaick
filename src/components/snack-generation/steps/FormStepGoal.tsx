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
              className={`flex items-start p-4 rounded-md border w-full text-left ${
                selectedGoal === option.value ? "border-primary bg-primary/5" : ""
              } hover:border-primary transition-colors`}
              onClick={() => handleGoalChange(option.value)}
              type="button"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="text-2xl mt-1" aria-hidden="true">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <Label htmlFor={option.value} className="text-base font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </RadioGroup>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Wstecz
          </Button>
          <Button type="button" onClick={handleNext}>
            Dalej
          </Button>
        </div>
      </div>
    </FormStep>
  );
}
