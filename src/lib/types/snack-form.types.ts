import type { Goal, Location, PreferredDiet, SnackType } from "../../types";
import type { SnackDetailsResponse } from "../../types";

/**
 * Form state for the snack generation form
 */
export interface FormState {
  currentStep: number;
  totalSteps: number;
  meals_eaten: string;
  snack_type: SnackType;
  location: Location;
  goal: Goal;
  preferred_diet: PreferredDiet;
  dietary_restrictions: string[];
  caloric_limit: number | null;
  isLoading: boolean;
  recommendation: SnackDetailsResponse | null;
  error: string | null;
}

/**
 * Action types for the form reducer
 */
export type FormAction =
  | { type: "SET_MEALS"; payload: string }
  | { type: "SET_SNACK_TYPE"; payload: SnackType }
  | { type: "SET_LOCATION"; payload: Location }
  | { type: "SET_GOAL"; payload: Goal }
  | { type: "SET_PREFERRED_DIET"; payload: PreferredDiet }
  | { type: "SET_DIETARY_RESTRICTIONS"; payload: string[] }
  | { type: "SET_CALORIC_LIMIT"; payload: number | null }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SKIP_STEP" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RECOMMENDATION"; payload: SnackDetailsResponse }
  | { type: "CLEAR_RECOMMENDATION" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_FORM" };

/**
 * Props for step components
 */
export interface StepProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
}

/**
 * Props for the progress indicator component
 */
export interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

/**
 * Props for the loading indicator component
 */
export interface LoadingIndicatorProps {
  message?: string;
}

/**
 * Props for the snack recommendation component
 */
export interface SnackRecommendationProps {
  recommendation: SnackDetailsResponse;
  onGenerateNew: () => void;
  onSaveToFavorites: () => void;
  isLoading: boolean;
}

/**
 * Re-export the GenerateSnackRequest type for use in the form
 */
export type { GenerateSnackRequest } from "../../types";
