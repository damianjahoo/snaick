import { useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SnackFormProgress } from "./SnackFormProgress";
import { FormStepMeals } from "./steps/FormStepMeals";
import { FormStepSnackType } from "./steps/FormStepSnackType";
import { FormStepLocation } from "./steps/FormStepLocation";
import { FormStepGoal } from "./steps/FormStepGoal";
import { FormStepPreferredDiet } from "./steps/FormStepPreferredDiet";
import { FormStepDietaryRestrictions } from "./steps/FormStepDietaryRestrictions";
import { FormStepCaloricLimit } from "./steps/FormStepCaloricLimit";
import { LoadingIndicator } from "./LoadingIndicator";
import { SnackRecommendation } from "./SnackRecommendation";
import { useSnackGeneration } from "../../lib/hooks/useSnackGeneration";
import { toast } from "sonner";
import type { FormAction, FormState, GenerateSnackRequest } from "../../lib/types/snack-form.types";

const initialState: FormState = {
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

function formReducer(state: FormState, action: FormAction): FormState {
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
      return { ...initialState };
    default:
      return state;
  }
}

export default function GenerateSnackForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { generateSnack } = useSnackGeneration();

  // Animation direction state
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleNext = () => {
    setDirection("right");
    dispatch({ type: "NEXT_STEP" });
  };

  const handlePrev = () => {
    setDirection("left");
    dispatch({ type: "PREV_STEP" });
  };

  const handleSkip = () => {
    setDirection("right");
    dispatch({ type: "SKIP_STEP" });
  };

  const handleSubmit = async () => {
    if (!state.snack_type || !state.location || !state.goal || !state.preferred_diet || !state.meals_eaten) {
      dispatch({ type: "SET_ERROR", payload: "Proszę wypełnić wszystkie wymagane pola formularza" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Prepare form data
      const formData: GenerateSnackRequest = {
        meals_eaten: state.meals_eaten,
        snack_type: state.snack_type,
        location: state.location,
        goal: state.goal,
        preferred_diet: state.preferred_diet,
        dietary_restrictions: state.dietary_restrictions,
        caloric_limit: state.caloric_limit,
      };

      // Call API
      const recommendation = await generateSnack(formData);

      // Update state
      dispatch({ type: "SET_RECOMMENDATION", payload: recommendation });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Nieznany błąd",
      });
    }
  };

  const handleGenerateNew = async () => {
    dispatch({ type: "CLEAR_RECOMMENDATION" });
    await handleSubmit();
  };

  const handleSaveToFavorites = async () => {
    if (!state.recommendation) return;

    try {
      const response = await fetch("/api/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ snack_id: state.recommendation.id }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error cases
        if (response.status === 409) {
          throw new Error("Ta przekąska już znajduje się w Twoich ulubionych");
        } else if (response.status === 404) {
          throw new Error("Nie znaleziono przekąski");
        } else if (response.status === 401) {
          throw new Error("Musisz być zalogowany, aby dodać przekąskę do ulubionych");
        } else {
          // For RLS errors, provide more specific message
          if (errorData.message && errorData.message.includes("row-level security policy")) {
            throw new Error("Problem z uwierzytelnieniem. Spróbuj się wylogować i zalogować ponownie.");
          }
          throw new Error(errorData.error || "Nie udało się zapisać przekąski do ulubionych");
        }
      }

      // Show success toast instead of alert
      toast.success("Przekąska dodana do ulubionych");
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Nieznany błąd",
      });
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderCurrentStep = () => {
    if (state.recommendation) {
      return (
        <SnackRecommendation
          recommendation={state.recommendation}
          onGenerateNew={handleGenerateNew}
          onSaveToFavorites={handleSaveToFavorites}
          isLoading={state.isLoading}
        />
      );
    }

    if (state.isLoading) {
      return <LoadingIndicator message="Generuję idealną przekąskę dla Ciebie..." />;
    }

    switch (state.currentStep) {
      case 1:
        return <FormStepMeals state={state} dispatch={dispatch} onNext={handleNext} onPrev={handlePrev} />;
      case 2:
        return <FormStepSnackType state={state} dispatch={dispatch} onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <FormStepLocation state={state} dispatch={dispatch} onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <FormStepGoal state={state} dispatch={dispatch} onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <FormStepPreferredDiet state={state} dispatch={dispatch} onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return (
          <FormStepDietaryRestrictions
            state={state}
            dispatch={dispatch}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={handleSkip}
          />
        );
      case 7:
        return (
          <FormStepCaloricLimit
            state={state}
            dispatch={dispatch}
            onNext={handleSubmit}
            onPrev={handlePrev}
            onSkip={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      {!state.recommendation && <SnackFormProgress currentStep={state.currentStep} totalSteps={state.totalSteps} />}

      {state.error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-4 relative backdrop-blur-sm">
          <span className="block sm:inline">{state.error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-200 hover:text-red-100 transition-colors"
            onClick={() => dispatch({ type: "CLEAR_ERROR" })}
          >
            <span className="sr-only">Zamknij</span>
            <span>&times;</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={state.currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
