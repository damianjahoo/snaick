import type { GenerateSnackRequest } from "../../types";

// Response type for AI generation
interface AISnackResponse {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
}

export class AIService {
  /**
   * Mock implementation that returns a simple snack matching the criteria
   * In production, this would call the OpenRouter API
   */
  async generateSnackRecommendation(preferences: GenerateSnackRequest): Promise<AISnackResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response based on preferences
    return this.generateMockResponse(preferences);
  }

  private buildPrompt(preferences: GenerateSnackRequest): string {
    return `Generate a snack recommendation based on the following preferences:
      - Meals eaten today: ${preferences.meals_eaten}
      - Snack type: ${preferences.snack_type}
      - Location: ${preferences.location}
      - Dietary goal: ${preferences.goal}
      - Preferred diet: ${preferences.preferred_diet}
      - Dietary restrictions: ${preferences.dietary_restrictions?.join(", ") || "None"}
      ${preferences.caloric_limit ? `- Caloric limit: ${preferences.caloric_limit} kcal` : ""}

      Respond with a JSON object that includes:
      - title: The name of the snack
      - description: A brief description
      - ingredients: List of ingredients
      - instructions: How to prepare the snack
      - kcal: Calories (number)
      - protein: Protein in grams (number)
      - fat: Fat in grams (number)
      - carbohydrates: Carbohydrates in grams (number)
      - fibre: Fibre in grams (number)
    `;
  }

  private generateMockResponse(preferences: GenerateSnackRequest): AISnackResponse {
    // Base mock responses for different snack types
    const mockResponses: Record<string, AISnackResponse> = {
      słodka: {
        title: "Jogurt z miodem i orzechami",
        description: "Szybki i pożywny deser jogurtowy z dodatkiem miodu i orzechów.",
        ingredients: "150g jogurtu greckiego, 1 łyżka miodu, 10g orzechów włoskich, szczypta cynamonu",
        instructions: "Wymieszaj jogurt z miodem. Posyp orzechami i cynamonem.",
        kcal: 220,
        protein: 12,
        fat: 10,
        carbohydrates: 18,
        fibre: 1.5,
      },
      słona: {
        title: "Hummus z warzywami",
        description: "Kremowy hummus podawany z świeżymi warzywami.",
        ingredients: "3 łyżki hummusu, 1 marchewka, 1 papryka, 5 plasterków ogórka",
        instructions: "Pokrój warzywa w słupki. Podawaj z hummusem.",
        kcal: 180,
        protein: 6,
        fat: 9,
        carbohydrates: 15,
        fibre: 6,
      },
      lekka: {
        title: "Miska owoców sezonowych",
        description: "Odświeżająca miska mieszanych owoców sezonowych.",
        ingredients: "100g truskawek, 50g jagód, 1 kiwi, 1/2 banana",
        instructions: "Umyj i pokrój owoce. Podawaj w misce.",
        kcal: 120,
        protein: 2,
        fat: 1,
        carbohydrates: 25,
        fibre: 5,
      },
      sycąca: {
        title: "Kanapka z indykiem i awokado",
        description: "Pożywna kanapka pełnoziarnista z indykiem i kremowym awokado.",
        ingredients: "2 kromki chleba pełnoziarnistego, 50g indyka, 1/2 awokado, liście sałaty, 1 plasterek pomidora",
        instructions: "Rozłóż awokado na chlebie. Dodaj plasterki indyka, sałatę i pomidora.",
        kcal: 320,
        protein: 18,
        fat: 14,
        carbohydrates: 30,
        fibre: 8,
      },
    };

    // Adjust mock response based on dietary preferences
    let response = { ...mockResponses[preferences.snack_type] };

    // Adjust for diet type
    if (preferences.preferred_diet === "wegetariańska" && preferences.snack_type === "sycąca") {
      response = {
        title: "Kanapka z jajkiem i awokado",
        description: "Pożywna kanapka wegetariańska z jajkiem i kremowym awokado.",
        ingredients:
          "2 kromki chleba pełnoziarnistego, 1 jajko na twardo, 1/2 awokado, liście sałaty, 1 plasterek pomidora",
        instructions: "Rozłóż awokado na chlebie. Dodaj plasterki jajka, sałatę i pomidora.",
        kcal: 300,
        protein: 14,
        fat: 16,
        carbohydrates: 28,
        fibre: 7,
      };
    } else if (preferences.preferred_diet === "wegańska") {
      if (preferences.snack_type === "słodka") {
        response = {
          title: "Pudding chia z owocami",
          description: "Wegański pudding z nasion chia z dodatkiem owoców i syropu klonowego.",
          ingredients: "3 łyżki nasion chia, 250ml mleka roślinnego, 1 łyżka syropu klonowego, garść owoców jagodowych",
          instructions: "Wymieszaj nasiona chia z mlekiem roślinnym i syropem. Odstaw na 15 minut. Udekoruj owocami.",
          kcal: 200,
          protein: 6,
          fat: 9,
          carbohydrates: 22,
          fibre: 10,
        };
      } else if (preferences.snack_type === "sycąca") {
        response = {
          title: "Wrap z tofu i warzywami",
          description: "Pożywny wrap z marynowanym tofu i kolorowymi warzywami.",
          ingredients: "1 tortilla pełnoziarnista, 80g marynowanego tofu, 1/4 papryki, garść szpinaku, 2 łyżki hummusu",
          instructions: "Rozsmaruj hummus na tortilli. Dodaj pokrojone tofu i warzywa. Zawiń w formę wrapa.",
          kcal: 310,
          protein: 15,
          fat: 12,
          carbohydrates: 32,
          fibre: 7,
        };
      }
    }

    // Adjust for caloric limit if specified
    if (preferences.caloric_limit && response.kcal > preferences.caloric_limit) {
      // Reduce portion size to meet caloric limit
      const reductionFactor = preferences.caloric_limit / response.kcal;
      response.kcal = Math.round(response.kcal * reductionFactor);
      response.protein = Math.round(response.protein * reductionFactor * 10) / 10;
      response.fat = Math.round(response.fat * reductionFactor * 10) / 10;
      response.carbohydrates = Math.round(response.carbohydrates * reductionFactor * 10) / 10;
      response.fibre = Math.round(response.fibre * reductionFactor * 10) / 10;
      response.description = `Mniejsza porcja: ${response.description}`;
    }

    return response;
  }
}
