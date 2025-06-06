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
import { formReducer, initialFormState } from "../../lib/utils/form-reducer";
import { validateRequiredFields, transformFormStateToRequest } from "../../lib/utils/form-validation";
import {
  mapFavoritesError,
  createFavoritesPayload,
  createFavoritesRequestOptions,
} from "../../lib/utils/favorites-error-handler";

export default function GenerateSnackForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
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
    const validationError = validateRequiredFields(state);
    if (validationError) {
      dispatch({ type: "SET_ERROR", payload: validationError });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Prepare form data
      const formData = transformFormStateToRequest(state);

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
      const payload = createFavoritesPayload(state.recommendation.id);
      const options = createFavoritesRequestOptions(payload);

      const response = await fetch("/api/favorites/add", options);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = mapFavoritesError(response.status, errorData);
        throw new Error(errorMessage);
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
