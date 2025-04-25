import type { SnackRecommendationProps } from "../../lib/types/snack-form.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function SnackRecommendation({
  recommendation,
  onGenerateNew,
  onSaveToFavorites,
  isLoading,
}: SnackRecommendationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{recommendation.title}</CardTitle>
          <CardDescription>{recommendation.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Nutritional values */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Kalorie</span>
                <span className="text-xl font-bold">{recommendation.kcal} kcal</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Białko</span>
                <span className="text-xl font-bold">{recommendation.protein} g</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Tłuszcz</span>
                <span className="text-xl font-bold">{recommendation.fat} g</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Węglowodany</span>
                <span className="text-xl font-bold">{recommendation.carbohydrates} g</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground">Błonnik</span>
                <span className="text-xl font-bold">{recommendation.fibre} g</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Składniki:</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                {recommendation.ingredients.split("\n").map((ingredient, index) => (
                  <div key={index} className="pb-1">
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Sposób przygotowania:</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                {recommendation.instructions.split("\n").map((step, index) => (
                  <div key={index} className="pb-2">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <span className="text-sm block">Typ</span>
                <span className="font-medium capitalize">{recommendation.snack_type}</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <span className="text-sm block">Lokalizacja</span>
                <span className="font-medium capitalize">{recommendation.location}</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <span className="text-sm block">Cel</span>
                <span className="font-medium capitalize">{recommendation.goal}</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <span className="text-sm block">Dieta</span>
                <span className="font-medium capitalize">{recommendation.preferred_diet}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button onClick={onGenerateNew} variant="outline" className="flex-1" disabled={isLoading}>
          {isLoading ? "Generowanie..." : "Wygeneruj inną propozycję"}
        </Button>
        <Button onClick={onSaveToFavorites} className="flex-1" disabled={isLoading}>
          Zapisz do ulubionych
        </Button>
      </div>
    </div>
  );
}
