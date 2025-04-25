import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import type { PreferredDiet } from "../../../types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface DietOption {
  value: PreferredDiet;
  label: string;
  description: string;
  icon: string;
}

const dietOptions: DietOption[] = [
  {
    value: "standard",
    label: "Standardowa",
    description: "Brak specjalnych ograniczeń dietetycznych",
    icon: "🍽️",
  },
  {
    value: "wegetariańska",
    label: "Wegetariańska",
    description: "Bez mięsa, dopuszcza nabiał i jajka",
    icon: "🥦",
  },
  {
    value: "wegańska",
    label: "Wegańska",
    description: "Bez produktów pochodzenia zwierzęcego",
    icon: "🌱",
  },
  {
    value: "bezglutenowa",
    label: "Bezglutenowa",
    description: "Bez produktów zawierających gluten",
    icon: "🚫",
  },
];

export function FormStepPreferredDiet({ state, dispatch, onNext, onPrev }: StepProps) {
  const [selectedDiet, setSelectedDiet] = useState<PreferredDiet | null>(state.preferred_diet);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update local state when global state changes
    setSelectedDiet(state.preferred_diet);
  }, [state.preferred_diet]);

  const handleDietChange = (value: PreferredDiet) => {
    setSelectedDiet(value);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedDiet) {
      setError("Proszę wybrać preferowaną dietę");
      return;
    }

    dispatch({ type: "SET_PREFERRED_DIET", payload: selectedDiet });
    onNext();
  };

  return (
    <FormStep
      title="Jaka jest Twoja preferowana dieta?"
      description="Wybierz rodzaj diety, która najlepiej odpowiada Twoim preferencjom."
    >
      <div className="space-y-6">
        <RadioGroup
          value={selectedDiet || ""}
          onValueChange={(value) => handleDietChange(value as PreferredDiet)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {dietOptions.map((option) => (
            <button
              key={option.value}
              className={`flex flex-col text-left p-4 rounded-md border cursor-pointer ${
                selectedDiet === option.value ? "border-primary bg-primary/5" : ""
              } hover:border-primary transition-colors`}
              onClick={() => handleDietChange(option.value)}
              type="button"
            >
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <div className="flex items-center">
                <span className="text-xl mr-2">{option.icon}</span>
                <Label htmlFor={option.value} className="text-base font-medium cursor-pointer">
                  {option.label}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
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
