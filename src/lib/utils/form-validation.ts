import type { FormState, GenerateSnackRequest } from "../types/snack-form.types";

/**
 * Validates if all required form fields are filled
 */
export function validateRequiredFields(state: FormState): string | null {
  if (!state.meals_eaten?.trim()) {
    return "Proszę wypełnić wszystkie wymagane pola formularza";
  }
  if (!state.snack_type) {
    return "Proszę wypełnić wszystkie wymagane pola formularza";
  }
  if (!state.location) {
    return "Proszę wypełnić wszystkie wymagane pola formularza";
  }
  if (!state.goal) {
    return "Proszę wypełnić wszystkie wymagane pola formularza";
  }
  if (!state.preferred_diet) {
    return "Proszę wypełnić wszystkie wymagane pola formularza";
  }
  return null;
}

/**
 * Converts form state to API request format
 */
export function transformFormStateToRequest(state: FormState): GenerateSnackRequest {
  return {
    meals_eaten: state.meals_eaten,
    snack_type: state.snack_type,
    location: state.location,
    goal: state.goal,
    preferred_diet: state.preferred_diet,
    dietary_restrictions: state.dietary_restrictions,
    caloric_limit: state.caloric_limit,
  };
}

/**
 * Validates caloric limit input
 */
export function validateCaloricLimit(value: number | null, min = 50, max = 500): string | null {
  if (value === null) {
    return null; // Optional field
  }

  if (isNaN(value)) {
    return "Proszę wprowadzić liczbę";
  }

  if (value < min) {
    return `Minimalna wartość to ${min} kcal`;
  }

  if (value > max) {
    return `Maksymalna wartość to ${max} kcal`;
  }

  return null;
}

/**
 * Validates meals input
 */
export function validateMealsInput(meals: string): string | null {
  if (!meals?.trim()) {
    return "Proszę opisać co jadłeś/aś dzisiaj";
  }

  if (meals.trim().length < 3) {
    return "Proszę opisać co jadłeś/aś dzisiaj (minimum 3 znaki)";
  }

  return null;
}
