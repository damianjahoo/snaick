import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import type { SnackType } from "../../../types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface SnackTypeOption {
  value: SnackType;
  label: string;
  description: string;
  icon: string;
}

const snackTypeOptions: SnackTypeOption[] = [
  {
    value: "słodka",
    label: "Słodka",
    description: "Coś słodkiego, np. owoc, deser, przekąska z czekoladą",
    icon: "🍰",
  },
  {
    value: "słona",
    label: "Słona",
    description: "Coś słonego, np. krakersy, chipsy, orzeszki",
    icon: "🥨",
  },
  {
    value: "lekka",
    label: "Lekka",
    description: "Coś lekkiego, niskokalorycznego",
    icon: "🥗",
  },
  {
    value: "sycąca",
    label: "Sycąca",
    description: "Coś bardziej treściwego, co da uczucie sytości",
    icon: "🍔",
  },
];

export function FormStepSnackType({ state, dispatch, onNext, onPrev }: StepProps) {
  const [selectedType, setSelectedType] = useState<SnackType | null>(state.snack_type);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update local state when global state changes
    setSelectedType(state.snack_type);
  }, [state.snack_type]);

  const handleTypeChange = (value: SnackType) => {
    setSelectedType(value);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedType) {
      setError("Proszę wybrać rodzaj przekąski");
      return;
    }

    dispatch({ type: "SET_SNACK_TYPE", payload: selectedType });
    onNext();
  };

  return (
    <FormStep
      title="Jaki rodzaj przekąski Cię interesuje?"
      description="Wybierz rodzaj przekąski, który najbardziej Ci odpowiada w tym momencie."
    >
      <div className="space-y-6">
        <RadioGroup
          value={selectedType || ""}
          onValueChange={(value) => handleTypeChange(value as SnackType)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {snackTypeOptions.map((option) => (
            <div
              key={option.value}
              className={`flex flex-col p-4 rounded-md border cursor-pointer hover:border-primary ${
                selectedType === option.value ? "border-primary bg-primary/5" : "border-gray-200"
              }`}
              onClick={() => handleTypeChange(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleTypeChange(option.value)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl" aria-hidden="true">
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
            </div>
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
