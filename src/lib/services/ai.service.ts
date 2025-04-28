import type { GenerateSnackRequest } from "../../types";
import { OpenRouterService } from "./openrouter/service";
import { ValidationError } from "./openrouter/errors";
import { mapOpenRouterToSnackResponse } from "../mappers/ai-response.mapper";
import type { Message, ResponseFormat } from "../../types";

// Response type for AI generation
export interface AISnackResponse {
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
  private openRouter: OpenRouterService;

  constructor(
    config: {
      apiKey?: string;
    } = {}
  ) {
    // Use API key from config or from environment variables
    const apiKey = config.apiKey || import.meta.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OpenRouter API key is required. Please provide it via config or set OPENROUTER_API_KEY in .env");
    }

    // Initialize OpenRouter service
    this.openRouter = new OpenRouterService({
      apiKey,
      defaultModel: "microsoft/mai-ds-r1:free",
      defaultParams: {
        temperature: 0.7,
        max_tokens: 1500,
      },
    });
  }

  /**
   * Generates a snack recommendation based on user preferences
   * Uses direct OpenRouter API calls
   */
  async generateSnackRecommendation(preferences: GenerateSnackRequest): Promise<AISnackResponse> {
    try {
      // Create JSON response format schema
      const responseFormat = this.openRouter.createJsonResponseFormat("snackResponse", {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          ingredients: { type: "string" },
          instructions: { type: "string" },
          kcal: { type: "number" },
          protein: { type: "number" },
          fat: { type: "number" },
          carbohydrates: { type: "number" },
          fibre: { type: "number" },
        },
        required: [
          "title",
          "description",
          "ingredients",
          "instructions",
          "kcal",
          "protein",
          "fat",
          "carbohydrates",
          "fibre",
        ],
      });

      // Send request to OpenRouter API
      const prompt = this.buildPrompt(preferences);

      // Check if the model supports structured output
      const modelSupportsStructuredOutput = this.openRouter.isModelCapableOfStructuredOutput();

      // Prepare chat request options
      const chatOptions: {
        messages: Message[];
        responseFormat?: ResponseFormat;
      } = {
        messages: [
          {
            role: "system",
            content:
              "You are a nutritionist assistant that specializes in snack recommendations based on user preferences. Always respond with valid JSON object that follows the exact schema provided. Do not provide any additional text or comments.",
          },
          { role: "user", content: prompt },
        ],
      };

      // Only include responseFormat if the model supports it
      if (modelSupportsStructuredOutput) {
        chatOptions.responseFormat = responseFormat;
      }

      // Send the request
      const response = await this.openRouter.chat(chatOptions);

      // Use the mapper to extract and transform the JSON from the text response
      const snackResponse = mapOpenRouterToSnackResponse(response.content);

      return snackResponse;
    } catch {
      // Fallback to mock response in case of error
      return this.generateMockResponse(preferences);
    }
  }

  private validateSnackResponse(response: AISnackResponse): void {
    const requiredFields = [
      "title",
      "description",
      "ingredients",
      "instructions",
      "kcal",
      "protein",
      "fat",
      "carbohydrates",
      "fibre",
    ];

    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Validate numeric fields
    const numericFields = ["kcal", "protein", "fat", "carbohydrates", "fibre"];
    for (const field of numericFields) {
      if (
        typeof response[field as keyof AISnackResponse] !== "number" ||
        isNaN(response[field as keyof AISnackResponse] as number)
      ) {
        throw new ValidationError(`Field ${field} must be a valid number`);
      }
    }
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
