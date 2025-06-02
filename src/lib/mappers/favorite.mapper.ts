import type {
  UserFavorite,
  Snack,
  FavoriteListItemResponse,
  FavoriteDetailsResponse,
  AddFavoriteResponse,
  SnackDetailsResponse,
} from "../../types";

/**
 * Maps database UserFavorite with joined Snack data to FavoriteListItemResponse
 */
export function mapToFavoriteListItem(
  favorite: UserFavorite & { snacks: Pick<Snack, "id" | "title" | "description" | "kcal"> }
): FavoriteListItemResponse {
  return {
    id: generateCompositeId(favorite.user_id, favorite.snack_id),
    snack_id: favorite.snack_id,
    title: favorite.snacks.title,
    description: favorite.snacks.description || "",
    kcal: favorite.snacks.kcal,
    added_at: favorite.added_at,
  };
}

/**
 * Maps database UserFavorite with full Snack data to FavoriteDetailsResponse
 */
export function mapToFavoriteDetails(favorite: UserFavorite & { snacks: Snack }): FavoriteDetailsResponse {
  return {
    id: generateCompositeId(favorite.user_id, favorite.snack_id),
    snack_id: favorite.snack_id,
    user_id: favorite.user_id,
    added_at: favorite.added_at,
    snack: mapToSnackDetails(favorite.snacks),
  };
}

/**
 * Maps database UserFavorite to AddFavoriteResponse
 */
export function mapToAddFavoriteResponse(favorite: UserFavorite): AddFavoriteResponse {
  return {
    id: generateCompositeId(favorite.user_id, favorite.snack_id),
    user_id: favorite.user_id,
    snack_id: favorite.snack_id,
    added_at: favorite.added_at,
  };
}

/**
 * Maps database Snack to SnackDetailsResponse
 */
function mapToSnackDetails(snack: Snack): SnackDetailsResponse {
  return {
    id: snack.id,
    title: snack.title,
    description: snack.description || "",
    ingredients: snack.ingredients || "",
    instructions: snack.instructions || "",
    snack_type: snack.snack_type,
    location: snack.location,
    goal: snack.goal,
    preferred_diet: snack.preferred_diet,
    kcal: snack.kcal,
    protein: snack.protein,
    fat: snack.fat,
    carbohydrates: snack.carbohydrates,
    fibre: snack.fibre,
    created_at: snack.created_at,
  };
}

/**
 * Generates a unique composite ID from user_id and snack_id
 * Uses a simple hash-like function to create a numeric ID
 */
function generateCompositeId(userId: string, snackId: number): number {
  // Simple hash function for generating numeric ID from user_id and snack_id
  let hash = 0;
  const str = `${userId}-${snackId}`;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}
