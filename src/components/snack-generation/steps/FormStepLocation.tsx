import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import type { Location } from "../../../types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

interface LocationOption {
  value: Location;
  label: string;
  description: string;
  icon: string; // Emoji as simple icon
}

const locationOptions: LocationOption[] = [
  {
    value: "praca",
    label: "Praca/Szkoła",
    description: "Przekąska, którą możesz zjeść w pracy lub szkole",
    icon: "💼",
  },
  {
    value: "dom",
    label: "Dom",
    description: "Przekąska, którą możesz przygotować w domu",
    icon: "🏠",
  },
  {
    value: "sklep",
    label: "Sklep",
    description: "Gotowa przekąska, którą możesz kupić w sklepie",
    icon: "🛒",
  },
  {
    value: "poza domem",
    label: "Poza domem",
    description: "Przekąska na wynos, w podróży lub spacerze",
    icon: "🚶",
  },
];

export function FormStepLocation({ state, dispatch, onNext, onPrev }: StepProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(state.location);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update local state when global state changes
    setSelectedLocation(state.location);
  }, [state.location]);

  const handleLocationChange = (value: Location) => {
    setSelectedLocation(value);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedLocation) {
      setError("Proszę wybrać lokalizację");
      return;
    }

    dispatch({ type: "SET_LOCATION", payload: selectedLocation });
    onNext();
  };

  return (
    <FormStep
      title="Gdzie będziesz spożywać przekąskę?"
      description="Wybierz miejsce, gdzie będziesz spożywać lub przygotowywać przekąskę."
    >
      <div className="space-y-6">
        <RadioGroup
          value={selectedLocation || ""}
          onValueChange={(value) => handleLocationChange(value as Location)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {locationOptions.map((option) => (
            <div
              key={option.value}
              className={`flex flex-col p-4 rounded-md border cursor-pointer hover:border-primary ${
                selectedLocation === option.value ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleLocationChange(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleLocationChange(option.value)}
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
