import { describe, it, expect, beforeEach } from "vitest";
import { formReducer, initialFormState } from "../../lib/utils/form-reducer";
import {
  validateRequiredFields,
  transformFormStateToRequest,
  validateCaloricLimit,
  validateMealsInput,
} from "../../lib/utils/form-validation";
import {
  mapFavoritesError,
  createFavoritesPayload,
  createFavoritesRequestOptions,
} from "../../lib/utils/favorites-error-handler";
import type { FormState, FormAction, GenerateSnackRequest } from "../../lib/types/snack-form.types";
import type { SnackDetailsResponse } from "../../types";

// Mock snack recommendation data
const mockSnackRecommendation: SnackDetailsResponse = {
  id: 123,
  title: "Test Snack",
  description: "A tasty test snack",
  ingredients: "Test ingredients",
  instructions: "Mix and eat",
  snack_type: "słodka",
  location: "praca",
  goal: "utrzymanie",
  preferred_diet: "standard",
  kcal: 150,
  protein: 5,
  fat: 8,
  carbohydrates: 15,
  fibre: 2,
  created_at: "2023-01-01T00:00:00Z",
};

describe("Form Reducer", () => {
  describe("formReducer", () => {
    let state: FormState;

    beforeEach(() => {
      state = { ...initialFormState };
    });

    it("should handle SET_MEALS action", () => {
      const action: FormAction = { type: "SET_MEALS", payload: "breakfast and lunch" };
      const newState = formReducer(state, action);

      expect(newState.meals_eaten).toBe("breakfast and lunch");
      expect(newState).not.toBe(state); // Immutability check
    });

    it("should handle SET_SNACK_TYPE action", () => {
      const action: FormAction = { type: "SET_SNACK_TYPE", payload: "słona" };
      const newState = formReducer(state, action);

      expect(newState.snack_type).toBe("słona");
    });

    it("should handle SET_LOCATION action", () => {
      const action: FormAction = { type: "SET_LOCATION", payload: "dom" };
      const newState = formReducer(state, action);

      expect(newState.location).toBe("dom");
    });

    it("should handle SET_GOAL action", () => {
      const action: FormAction = { type: "SET_GOAL", payload: "redukcja" };
      const newState = formReducer(state, action);

      expect(newState.goal).toBe("redukcja");
    });

    it("should handle SET_PREFERRED_DIET action", () => {
      const action: FormAction = { type: "SET_PREFERRED_DIET", payload: "wegańska" };
      const newState = formReducer(state, action);

      expect(newState.preferred_diet).toBe("wegańska");
    });

    it("should handle SET_DIETARY_RESTRICTIONS action", () => {
      const restrictions = ["gluten-free", "dairy-free"];
      const action: FormAction = { type: "SET_DIETARY_RESTRICTIONS", payload: restrictions };
      const newState = formReducer(state, action);

      expect(newState.dietary_restrictions).toEqual(restrictions);
    });

    it("should handle SET_CALORIC_LIMIT action", () => {
      const action: FormAction = { type: "SET_CALORIC_LIMIT", payload: 300 };
      const newState = formReducer(state, action);

      expect(newState.caloric_limit).toBe(300);
    });

    it("should handle NEXT_STEP action within bounds", () => {
      const action: FormAction = { type: "NEXT_STEP" };
      const newState = formReducer(state, action);

      expect(newState.currentStep).toBe(2);
    });

    it("should not exceed totalSteps on NEXT_STEP", () => {
      const stateAtLastStep = { ...state, currentStep: 7 };
      const action: FormAction = { type: "NEXT_STEP" };
      const newState = formReducer(stateAtLastStep, action);

      expect(newState.currentStep).toBe(7);
    });

    it("should handle PREV_STEP action within bounds", () => {
      const stateAtStep2 = { ...state, currentStep: 2 };
      const action: FormAction = { type: "PREV_STEP" };
      const newState = formReducer(stateAtStep2, action);

      expect(newState.currentStep).toBe(1);
    });

    it("should not go below step 1 on PREV_STEP", () => {
      const action: FormAction = { type: "PREV_STEP" };
      const newState = formReducer(state, action);

      expect(newState.currentStep).toBe(1);
    });

    it("should handle SKIP_STEP action", () => {
      const action: FormAction = { type: "SKIP_STEP" };
      const newState = formReducer(state, action);

      expect(newState.currentStep).toBe(2);
    });

    it("should handle SET_LOADING action", () => {
      const action: FormAction = { type: "SET_LOADING", payload: true };
      const newState = formReducer(state, action);

      expect(newState.isLoading).toBe(true);
    });

    it("should handle SET_RECOMMENDATION action", () => {
      const action: FormAction = { type: "SET_RECOMMENDATION", payload: mockSnackRecommendation };
      const newState = formReducer(state, action);

      expect(newState.recommendation).toEqual(mockSnackRecommendation);
      expect(newState.isLoading).toBe(false);
    });

    it("should handle CLEAR_RECOMMENDATION action", () => {
      const stateWithRecommendation = { ...state, recommendation: mockSnackRecommendation };
      const action: FormAction = { type: "CLEAR_RECOMMENDATION" };
      const newState = formReducer(stateWithRecommendation, action);

      expect(newState.recommendation).toBeNull();
    });

    it("should handle SET_ERROR action", () => {
      const errorMessage = "Test error message";
      const action: FormAction = { type: "SET_ERROR", payload: errorMessage };
      const newState = formReducer(state, action);

      expect(newState.error).toBe(errorMessage);
      expect(newState.isLoading).toBe(false);
    });

    it("should handle CLEAR_ERROR action", () => {
      const stateWithError = { ...state, error: "Some error" };
      const action: FormAction = { type: "CLEAR_ERROR" };
      const newState = formReducer(stateWithError, action);

      expect(newState.error).toBeNull();
    });

    it("should handle RESET_FORM action", () => {
      const modifiedState = {
        ...state,
        currentStep: 5,
        meals_eaten: "test meals",
        snack_type: "słona" as const,
        error: "some error",
        isLoading: true,
      };
      const action: FormAction = { type: "RESET_FORM" };
      const newState = formReducer(modifiedState, action);

      expect(newState).toEqual(initialFormState);
    });

    it("should return unchanged state for unknown action", () => {
      const unknownAction = { type: "UNKNOWN_ACTION" } as unknown as FormAction;
      const newState = formReducer(state, unknownAction);

      expect(newState).toBe(state);
    });
  });
});

describe("Form Validation", () => {
  describe("validateRequiredFields", () => {
    it("should return null for valid state", () => {
      const validState: FormState = {
        ...initialFormState,
        meals_eaten: "breakfast and lunch",
        snack_type: "słodka",
        location: "praca",
        goal: "utrzymanie",
        preferred_diet: "standard",
      };

      const result = validateRequiredFields(validState);
      expect(result).toBeNull();
    });

    it("should return error for missing meals_eaten", () => {
      const invalidState: FormState = {
        ...initialFormState,
        meals_eaten: "",
      };

      const result = validateRequiredFields(invalidState);
      expect(result).toBe("Proszę wypełnić wszystkie wymagane pola formularza");
    });

    it("should return error for whitespace-only meals_eaten", () => {
      const invalidState: FormState = {
        ...initialFormState,
        meals_eaten: "   ",
      };

      const result = validateRequiredFields(invalidState);
      expect(result).toBe("Proszę wypełnić wszystkie wymagane pola formularza");
    });

    it("should return error for missing snack_type", () => {
      const invalidState: FormState = {
        ...initialFormState,
        meals_eaten: "test meals",
        snack_type: "" as never,
      };

      const result = validateRequiredFields(invalidState);
      expect(result).toBe("Proszę wypełnić wszystkie wymagane pola formularza");
    });
  });

  describe("transformFormStateToRequest", () => {
    it("should correctly transform form state to API request", () => {
      const state: FormState = {
        ...initialFormState,
        meals_eaten: "breakfast and lunch",
        snack_type: "słodka",
        location: "praca",
        goal: "utrzymanie",
        preferred_diet: "standard",
        dietary_restrictions: ["gluten-free"],
        caloric_limit: 200,
      };

      const result = transformFormStateToRequest(state);

      const expected: GenerateSnackRequest = {
        meals_eaten: "breakfast and lunch",
        snack_type: "słodka",
        location: "praca",
        goal: "utrzymanie",
        preferred_diet: "standard",
        dietary_restrictions: ["gluten-free"],
        caloric_limit: 200,
      };

      expect(result).toEqual(expected);
    });

    it("should handle null caloric_limit", () => {
      const state: FormState = {
        ...initialFormState,
        meals_eaten: "test meals",
        caloric_limit: null,
      };

      const result = transformFormStateToRequest(state);
      expect(result.caloric_limit).toBeNull();
    });
  });

  describe("validateCaloricLimit", () => {
    it("should return null for null value (optional field)", () => {
      const result = validateCaloricLimit(null);
      expect(result).toBeNull();
    });

    it("should return null for valid value within range", () => {
      const result = validateCaloricLimit(150);
      expect(result).toBeNull();
    });

    it("should return error for value below minimum", () => {
      const result = validateCaloricLimit(30);
      expect(result).toBe("Minimalna wartość to 50 kcal");
    });

    it("should return error for value above maximum", () => {
      const result = validateCaloricLimit(600);
      expect(result).toBe("Maksymalna wartość to 500 kcal");
    });

    it("should return error for NaN value", () => {
      const result = validateCaloricLimit(NaN);
      expect(result).toBe("Proszę wprowadzić liczbę");
    });

    it("should use custom min/max values", () => {
      const result = validateCaloricLimit(75, 100, 200);
      expect(result).toBe("Minimalna wartość to 100 kcal");
    });
  });

  describe("validateMealsInput", () => {
    it("should return null for valid input", () => {
      const result = validateMealsInput("breakfast and lunch");
      expect(result).toBeNull();
    });

    it("should return error for empty string", () => {
      const result = validateMealsInput("");
      expect(result).toBe("Proszę opisać co jadłeś/aś dzisiaj");
    });

    it("should return error for whitespace-only string", () => {
      const result = validateMealsInput("   ");
      expect(result).toBe("Proszę opisać co jadłeś/aś dzisiaj");
    });

    it("should return error for input shorter than 3 characters", () => {
      const result = validateMealsInput("ab");
      expect(result).toBe("Proszę opisać co jadłeś/aś dzisiaj (minimum 3 znaki)");
    });

    it("should return null for input exactly 3 characters", () => {
      const result = validateMealsInput("abc");
      expect(result).toBeNull();
    });
  });
});

describe("Favorites Error Handler", () => {
  describe("mapFavoritesError", () => {
    it("should return conflict message for 409 status", () => {
      const result = mapFavoritesError(409, {});
      expect(result).toBe("Ta przekąska już znajduje się w Twoich ulubionych");
    });

    it("should return not found message for 404 status", () => {
      const result = mapFavoritesError(404, {});
      expect(result).toBe("Nie znaleziono przekąski");
    });

    it("should return unauthorized message for 401 status", () => {
      const result = mapFavoritesError(401, {});
      expect(result).toBe("Musisz być zalogowany, aby dodać przekąskę do ulubionych");
    });

    it("should return RLS error message for security policy violation", () => {
      const errorData = { message: "violates row-level security policy for table users" };
      const result = mapFavoritesError(500, errorData);
      expect(result).toBe("Problem z uwierzytelnieniem. Spróbuj się wylogować i zalogować ponownie.");
    });

    it("should return custom error message when provided", () => {
      const errorData = { error: "Custom error message" };
      const result = mapFavoritesError(500, errorData);
      expect(result).toBe("Custom error message");
    });

    it("should return generic error message as fallback", () => {
      const result = mapFavoritesError(500, {});
      expect(result).toBe("Nie udało się zapisać przekąski do ulubionych");
    });
  });

  describe("createFavoritesPayload", () => {
    it("should create correct JSON payload with string ID", () => {
      const result = createFavoritesPayload("test-snack-123");
      expect(result).toBe('{"snack_id":"test-snack-123"}');
    });

    it("should create correct JSON payload with numeric ID", () => {
      const result = createFavoritesPayload(123);
      expect(result).toBe('{"snack_id":123}');
    });
  });

  describe("createFavoritesRequestOptions", () => {
    it("should create correct fetch options", () => {
      const payload = '{"snack_id":"test-123"}';
      const result = createFavoritesRequestOptions(payload);

      expect(result).toEqual({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        credentials: "include",
      });
    });
  });
});
