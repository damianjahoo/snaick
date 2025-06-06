import type { FormAction, FormState } from "../types/snack-form.types";

export const initialFormState: FormState = {
  currentStep: 1,
  totalSteps: 7,
  meals_eaten: "",
  snack_type: "słodka",
  location: "praca",
  goal: "utrzymanie",
  preferred_diet: "standard",
  dietary_restrictions: [],
  caloric_limit: null,
  isLoading: false,
  recommendation: null,
  error: null,
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_MEALS":
      return { ...state, meals_eaten: action.payload };
    case "SET_SNACK_TYPE":
      return { ...state, snack_type: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_GOAL":
      return { ...state, goal: action.payload };
    case "SET_PREFERRED_DIET":
      return { ...state, preferred_diet: action.payload };
    case "SET_DIETARY_RESTRICTIONS":
      return { ...state, dietary_restrictions: action.payload };
    case "SET_CALORIC_LIMIT":
      return { ...state, caloric_limit: action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep < state.totalSteps ? state.currentStep + 1 : state.currentStep,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: state.currentStep > 1 ? state.currentStep - 1 : state.currentStep,
      };
    case "SKIP_STEP":
      return {
        ...state,
        currentStep: state.currentStep < state.totalSteps ? state.currentStep + 1 : state.currentStep,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_RECOMMENDATION":
      return { ...state, recommendation: action.payload, isLoading: false };
    case "CLEAR_RECOMMENDATION":
      return { ...state, recommendation: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "RESET_FORM":
      return { ...initialFormState };
    default:
      return state;
  }
}
