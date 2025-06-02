import type { SupabaseClient } from "../../db/supabase.client";
import type {
  UserFavorite,
  Snack,
  FavoriteListResponse,
  FavoriteDetailsResponse,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
} from "../../types";
import { mapToFavoriteListItem, mapToFavoriteDetails, mapToAddFavoriteResponse } from "../mappers/favorite.mapper";

export class FavoriteService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get paginated list of user's favorite snacks
   */
  async getFavorites(params: { userId: string; page: number; limit: number }): Promise<FavoriteListResponse> {
    const { userId, page, limit } = params;

    // Calculate pagination range
    const start = (page - 1) * limit;
    const end = page * limit - 1;

    // Query favorites with joined snack data
    const { data, count, error } = await this.supabase
      .from("user_favourites")
      .select(
        `
        *,
        snacks:snack_id (
          id,
          title,
          description,
          kcal
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("added_at", { ascending: false })
      .range(start, end);

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from favorites query");
    }

    // Transform data to response format
    const transformedData = data.map((favorite) => {
      if (!favorite.snacks) {
        throw new Error("Snack data missing from favorite");
      }
      return mapToFavoriteListItem(
        favorite as UserFavorite & { snacks: Pick<Snack, "id" | "title" | "description" | "kcal"> }
      );
    });

    const meta = {
      total: count || 0,
      page,
      limit,
      has_more: count ? page * limit < count : false,
    };

    return { data: transformedData, meta };
  }

  /**
   * Get detailed information about a specific favorite
   */
  async getFavoriteById(params: { userId: string; favoriteId: number }): Promise<FavoriteDetailsResponse> {
    const { userId, favoriteId } = params;

    // Query all user favorites with full snack data to find the matching composite ID
    const { data, error } = await this.supabase
      .from("user_favourites")
      .select(
        `
        *,
        snacks:snack_id (*)
      `
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("Favorite not found");
    }

    // Find the record that matches the composite ID
    const targetFavorite = data.find((fav) => {
      if (!fav.snacks) return false;
      return this.generateCompositeId(fav.user_id, fav.snack_id) === favoriteId;
    });

    if (!targetFavorite || !targetFavorite.snacks) {
      throw new Error("Favorite not found");
    }

    return mapToFavoriteDetails(targetFavorite as UserFavorite & { snacks: Snack });
  }

  /**
   * Add a snack to user's favorites
   */
  async addFavorite(params: { userId: string; snackId: number }): Promise<AddFavoriteResponse> {
    const { userId, snackId } = params;

    // First check if snack exists
    const { data: snackData, error: snackError } = await this.supabase
      .from("snacks")
      .select("id")
      .eq("id", snackId)
      .single();

    if (snackError || !snackData) {
      throw new Error("Snack not found");
    }

    // Check if already in favorites
    const { data: existingFavorite, error: checkError } = await this.supabase
      .from("user_favourites")
      .select("*")
      .eq("user_id", userId)
      .eq("snack_id", snackId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(`Failed to check existing favorite: ${checkError.message}`);
    }

    if (existingFavorite) {
      throw new Error("Snack is already in favorites");
    }

    // Add to favorites
    const { data, error } = await this.supabase
      .from("user_favourites")
      .insert({
        user_id: userId,
        snack_id: snackId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add favorite: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after adding favorite");
    }

    return mapToAddFavoriteResponse(data as UserFavorite);
  }

  /**
   * Remove a snack from user's favorites
   */
  async removeFavorite(params: { userId: string; favoriteId: number }): Promise<RemoveFavoriteResponse> {
    const { userId, favoriteId } = params;

    // First find the favorite to get the actual snack_id
    const { data: favoriteData, error: findError } = await this.supabase
      .from("user_favourites")
      .select("*")
      .eq("user_id", userId);

    if (findError) {
      throw new Error(`Failed to find favorite: ${findError.message}`);
    }

    if (!favoriteData || favoriteData.length === 0) {
      throw new Error("Favorite not found");
    }

    // Find the record that matches the composite ID
    const targetFavorite = favoriteData.find(
      (fav) => this.generateCompositeId(fav.user_id, fav.snack_id) === favoriteId
    );

    if (!targetFavorite) {
      throw new Error("Favorite not found");
    }

    // Delete the favorite
    const { error } = await this.supabase
      .from("user_favourites")
      .delete()
      .eq("user_id", userId)
      .eq("snack_id", targetFavorite.snack_id);

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }

    return { success: true };
  }

  /**
   * Generate composite ID from user_id and snack_id
   * Must match the implementation in mapper
   */
  private generateCompositeId(userId: string, snackId: number): number {
    let hash = 0;
    const str = `${userId}-${snackId}`;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash);
  }
}
