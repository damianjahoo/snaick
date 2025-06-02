import { useState, useEffect } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import { FormStep } from "../FormStep";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";

export function FormStepMeals({ state, dispatch, onNext }: StepProps) {
  const [error, setError] = useState<string | null>(null);
  const [localMeals, setLocalMeals] = useState(state.meals_eaten);

  useEffect(() => {
    // Update local state when state changes (e.g. from localStorage)
    setLocalMeals(state.meals_eaten);
  }, [state.meals_eaten]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalMeals(e.target.value);
    setError(null);
  };

  const handleNext = () => {
    // Validate input
    if (localMeals.trim().length < 3) {
      setError("Proszę opisać co jadłeś/aś dzisiaj (minimum 3 znaki)");
      return;
    }

    // Update global state
    dispatch({ type: "SET_MEALS", payload: localMeals });
    onNext();
  };

  return (
    <FormStep
      title="Co jadłeś/aś dzisiaj?"
      description="Opowiedz nam co jadłeś/aś dzisiaj, abyśmy mogli zaproponować odpowiednią przekąskę."
    >
      <div className="space-y-4">
        <Textarea
          placeholder="Np. Na śniadanie jadłem/am kanapki z serem i kawę, na obiad makaron z sosem pomidorowym..."
          value={localMeals}
          onChange={handleChange}
          rows={5}
          className="bg-white/5 border-white/20 text-white placeholder:text-blue-100/50 focus-visible:ring-blue-300/50 focus-visible:border-blue-200/70 resize-none"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "meals-error" : undefined}
        />

        {error && (
          <p id="meals-error" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end pt-4">
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
