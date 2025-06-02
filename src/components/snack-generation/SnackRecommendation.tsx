import type { SnackRecommendationProps } from "../../lib/types/snack-form.types";
import { Button } from "../ui/button";

export function SnackRecommendation({
  recommendation,
  onGenerateNew,
  onSaveToFavorites,
  isLoading,
}: SnackRecommendationProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{recommendation.title}</h2>
          <p className="text-blue-100/80">{recommendation.description}</p>
        </div>
        <div className="space-y-6">
          {/* Nutritional values */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-100/70">Kalorie</span>
              <span className="text-xl font-bold text-white">{recommendation.kcal} kcal</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-100/70">Białko</span>
              <span className="text-xl font-bold text-white">{recommendation.protein} g</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-100/70">Tłuszcz</span>
              <span className="text-xl font-bold text-white">{recommendation.fat} g</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-100/70">Węglowodany</span>
              <span className="text-xl font-bold text-white">{recommendation.carbohydrates} g</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-100/70">Błonnik</span>
              <span className="text-xl font-bold text-white">{recommendation.fibre} g</span>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Składniki:</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-100/80">
              {recommendation.ingredients
                .split("\n")
                .filter((ingredient) => ingredient.trim())
                .map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient.trim()}</li>
                ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Instrukcje:</h3>
            <div className="text-blue-100/80 whitespace-pre-line">{recommendation.instructions}</div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-blue-200/10 p-3 rounded-lg text-center border border-blue-200/20">
              <span className="text-sm block text-blue-100/70">Typ</span>
              <span className="font-medium capitalize text-white">{recommendation.snack_type}</span>
            </div>
            <div className="bg-blue-200/10 p-3 rounded-lg text-center border border-blue-200/20">
              <span className="text-sm block text-blue-100/70">Lokalizacja</span>
              <span className="font-medium capitalize text-white">{recommendation.location}</span>
            </div>
            <div className="bg-blue-200/10 p-3 rounded-lg text-center border border-blue-200/20">
              <span className="text-sm block text-blue-100/70">Cel</span>
              <span className="font-medium capitalize text-white">{recommendation.goal}</span>
            </div>
            <div className="bg-blue-200/10 p-3 rounded-lg text-center border border-blue-200/20">
              <span className="text-sm block text-blue-100/70">Dieta</span>
              <span className="font-medium capitalize text-white">{recommendation.preferred_diet}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          onClick={onGenerateNew}
          className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Generowanie..." : "Wygeneruj inną propozycję"}
        </Button>
        <Button
          onClick={onSaveToFavorites}
          className="flex-1 bg-blue-200 text-black hover:bg-blue-300 focus-visible:ring-blue-300/50"
          disabled={isLoading}
        >
          Zapisz do ulubionych
        </Button>
      </div>
    </div>
  );
}
