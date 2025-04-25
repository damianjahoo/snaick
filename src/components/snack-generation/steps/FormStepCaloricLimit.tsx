import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Slider } from "../../ui/slider";

export function FormStepCaloricLimit({ state, dispatch, onNext, onPrev, onSkip }: StepProps) {
  const [caloricLimit, setCaloricLimit] = useState<number | null>(state.caloric_limit);
  const [error, setError] = useState<string | null>(null);

  const MIN_CALORIES = 50;
  const MAX_CALORIES = 500;
  const DEFAULT_CALORIES = 200;

  useEffect(() => {
    // Update local state when global state changes
    setCaloricLimit(state.caloric_limit);
  }, [state.caloric_limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value === "") {
      setCaloricLimit(null);
      setError(null);
      return;
    }

    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
      setError("Proszę wprowadzić liczbę");
      return;
    }

    if (numValue < MIN_CALORIES) {
      setError(`Minimalna wartość to ${MIN_CALORIES} kcal`);
      setCaloricLimit(numValue);
      return;
    }

    if (numValue > MAX_CALORIES) {
      setError(`Maksymalna wartość to ${MAX_CALORIES} kcal`);
      setCaloricLimit(numValue);
      return;
    }

    setCaloricLimit(numValue);
    setError(null);
  };

  const handleSliderChange = (value: number[]) => {
    setCaloricLimit(value[0]);
    setError(null);
  };

  const handleSubmit = () => {
    // If there's an error but within valid range, still allow submission
    if (error && caloricLimit && caloricLimit >= MIN_CALORIES && caloricLimit <= MAX_CALORIES) {
      dispatch({ type: "SET_CALORIC_LIMIT", payload: caloricLimit });
      onNext();
      return;
    }

    // If there's an error and outside valid range, prevent submission
    if (error) {
      return;
    }

    dispatch({ type: "SET_CALORIC_LIMIT", payload: caloricLimit });
    onNext();
  };

  const handleSkip = () => {
    if (onSkip) {
      dispatch({ type: "SET_CALORIC_LIMIT", payload: null });
      onSkip();
    }
  };

  return (
    <FormStep
      title="Jaki jest Twój limit kaloryczny dla przekąski?"
      description="Określ maksymalną liczbę kalorii, jaką powinna mieć Twoja przekąska."
      isOptional={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={caloricLimit === null ? "" : caloricLimit}
              onChange={handleInputChange}
              placeholder={`np. ${DEFAULT_CALORIES}`}
              className="w-24"
              min={MIN_CALORIES}
              max={MAX_CALORIES}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "caloric-limit-error" : undefined}
            />
            <span className="text-md font-medium">kcal</span>
          </div>

          {error && (
            <p id="caloric-limit-error" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="py-4">
            <Slider
              defaultValue={[caloricLimit || DEFAULT_CALORIES]}
              min={MIN_CALORIES}
              max={MAX_CALORIES}
              step={10}
              onValueChange={handleSliderChange}
              value={[caloricLimit === null ? DEFAULT_CALORIES : caloricLimit]}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{MIN_CALORIES} kcal</span>
              <span>{MAX_CALORIES} kcal</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Możesz pominąć ten krok, jeśli nie chcesz określać limitu kalorycznego.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Wstecz
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Pomiń
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                !!error && (caloricLimit === null || caloricLimit < MIN_CALORIES || caloricLimit > MAX_CALORIES)
              }
            >
              Znajdź przekąskę
            </Button>
          </div>
        </div>
      </div>
    </FormStep>
  );
}
