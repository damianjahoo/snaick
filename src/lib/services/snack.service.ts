import { AIService } from "./ai.service";
import type { SupabaseClient } from "../../db/supabase.client";
import type {
  GenerateSnackRequest,
  Snack,
  SnackDetailsResponse,
  SnackListResponse,
  SnackListItemResponse,
} from "../../types";

export class SnackService {
  private aiService: AIService;

  constructor(private supabase: SupabaseClient) {
    this.aiService = new AIService();
  }

  async generateSnackRecommendation(preferences: GenerateSnackRequest): Promise<SnackDetailsResponse> {
    // Generate recommendation using AI
    const aiResponse = await this.aiService.generateSnackRecommendation(preferences);

    // Format the snack data
    const snackData: Omit<Snack, "id" | "created_at"> = {
      title: aiResponse.title,
      description: aiResponse.description || "",
      ingredients: aiResponse.ingredients || "",
      instructions: aiResponse.instructions || "",
      snack_type: preferences.snack_type,
      location: preferences.location,
      goal: preferences.goal,
      preferred_diet: preferences.preferred_diet,
      kcal: aiResponse.kcal || 0,
      protein: aiResponse.protein || 0,
      fat: aiResponse.fat || 0,
      carbohydrates: aiResponse.carbohydrates || 0,
      fibre: aiResponse.fibre || 0,
    };

    // Save to database
    const { data, error } = await this.supabase.from("snacks").insert(snackData).select().single();

    if (error) {
      throw new Error("Failed to save snack recommendation");
    }

    if (!data) {
      throw new Error("No data returned after saving snack");
    }

    // Format database response as API response
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      ingredients: data.ingredients || "",
      instructions: data.instructions || "",
      snack_type: data.snack_type,
      location: data.location,
      goal: data.goal,
      preferred_diet: data.preferred_diet,
      kcal: data.kcal,
      protein: data.protein,
      fat: data.fat,
      carbohydrates: data.carbohydrates,
      fibre: data.fibre,
      created_at: data.created_at,
    };
  }

  async getSnacks(params: { userId: string; page: number; limit: number }): Promise<SnackListResponse> {
    const { page, limit } = params;

    // Calculate the pagination range
    const start = (page - 1) * limit;
    const end = page * limit - 1;

    // Query the snacks table with pagination; using exact count
    const { data, count, error } = await this.supabase.from("snacks").select("*", { count: "exact" }).range(start, end);

    if (error) {
      throw new Error(`Failed to fetch snacks: ${error.message}`);
    }

    const meta = {
      total: count || 0,
      page,
      limit,
      has_more: count ? page * limit < count : false,
    };

    // Transform the data to match SnackListItemResponse type
    const formattedData: SnackListItemResponse[] = ((data as Snack[]) || []).map(
      (item: Snack): SnackListItemResponse => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        kcal: item.kcal,
        created_at: item.created_at,
      })
    );

    return { data: formattedData, meta };
  }
}
