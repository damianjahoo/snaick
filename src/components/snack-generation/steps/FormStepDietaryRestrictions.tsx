import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import type { StepProps } from "../../../lib/types/snack-form.types";
import { FormStep } from "../FormStep";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";

const commonAllergens = ["orzechy", "gluten", "laktoza", "jajka", "soja", "ryby", "skorupiaki", "nabiał", "pszenica"];

export function FormStepDietaryRestrictions({ state, dispatch, onNext, onPrev, onSkip }: StepProps) {
  const [restrictions, setRestrictions] = useState<string[]>(state.dietary_restrictions);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Update local state when global state changes
    setRestrictions(state.dietary_restrictions);
  }, [state.dietary_restrictions]);

  const addRestriction = (restriction: string) => {
    const trimmed = restriction.trim().toLowerCase();
    if (trimmed && !restrictions.includes(trimmed)) {
      setRestrictions([...restrictions, trimmed]);
      setInputValue("");
    }
  };

  const removeRestriction = (indexToRemove: number) => {
    setRestrictions(restrictions.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addRestriction(inputValue);
    } else if (e.key === "Backspace" && !inputValue && restrictions.length > 0) {
      // Remove last tag when backspace is pressed in empty input
      setRestrictions(restrictions.slice(0, -1));
    }
  };

  const handleCommonRestrictionClick = (restriction: string) => {
    if (!restrictions.includes(restriction)) {
      setRestrictions([...restrictions, restriction]);
    }
  };

  const handleNext = () => {
    dispatch({ type: "SET_DIETARY_RESTRICTIONS", payload: restrictions });
    onNext();
  };

  const handleSkip = () => {
    if (onSkip) {
      // Clear restrictions if skipping
      dispatch({ type: "SET_DIETARY_RESTRICTIONS", payload: [] });
      onSkip();
    }
  };

  return (
    <FormStep
      title="Czy masz jakieś wykluczenia żywieniowe?"
      description="Dodaj produkty lub składniki, których nie możesz lub nie chcesz spożywać."
      isOptional={true}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
          {restrictions.map((restriction, index) => (
            <Badge key={index} variant="secondary" className="pl-2 h-7">
              {restriction}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
                onClick={() => removeRestriction(index)}
              >
                <Cross2Icon className="h-3 w-3" />
                <span className="sr-only">Usuń {restriction}</span>
              </Button>
            </Badge>
          ))}
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[150px] border-0 focus-visible:ring-0 p-0 h-7"
            placeholder={restrictions.length === 0 ? "Dodaj wykluczenia żywieniowe..." : "Dodaj więcej..."}
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Popularne alergeny i ograniczenia:</p>
          <div className="flex flex-wrap gap-2">
            {commonAllergens.map((allergen) => (
              <Badge
                key={allergen}
                variant={restrictions.includes(allergen) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCommonRestrictionClick(allergen)}
              >
                {allergen}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Wstecz
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Pomiń
            </Button>
            <Button type="button" onClick={handleNext}>
              Dalej
            </Button>
          </div>
        </div>
      </div>
    </FormStep>
  );
}
