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
            <Label
              key={option.value}
              htmlFor={option.value}
              className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                selectedDiet === option.value
                  ? "border-blue-200 bg-blue-200/10 shadow-lg"
                  : "border-white/20 bg-white/5 hover:border-blue-200/50 hover:bg-white/10"
              }`}
            >
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <div className="flex items-center">
                <span className="text-xl mr-2">{option.icon}</span>
                <span className="text-base font-medium text-white">{option.label}</span>
              </div>
              <p className="text-sm text-blue-100/70 mt-1">{option.description}</p>
            </Label>
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
