import type { Database } from "./db/database.types";

// ----------------------
// Enum Types
// ----------------------

/**
 * Type aliases for database enums for better code readability
 */
export type SnackType = Database["public"]["Enums"]["snack_type_enum"];
export type Location = Database["public"]["Enums"]["location_enum"];
export type Goal = Database["public"]["Enums"]["goal_enum"];
export type PreferredDiet = Database["public"]["Enums"]["preferred_diet_enum"];

// ----------------------
// Database Entity Types
// ----------------------

/**
 * Represents a snack from the database
 */
export type Snack = Database["public"]["Tables"]["snacks"]["Row"];

/**
 * Represents a user favorite from the database
 */
export type UserFavorite = Database["public"]["Tables"]["user_favourites"]["Row"];

// ----------------------
// Authentication DTOs
// ----------------------

/**
 * Request model for user registration
 */
export interface RegisterDTO {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Request model for user login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Request model for password reset request
 */
export interface PasswordResetRequestDTO {
  email: string;
}

/**
 * Request model for password reset confirmation
 */
export interface PasswordResetDTO {
  token: string;
  newPassword: string;
}

// ----------------------
// Command Models (Request DTOs)
// ----------------------

/**
 * Request model for generating a snack recommendation
 */
export interface GenerateSnackRequest {
  meals_eaten: string;
  snack_type: SnackType;
  location: Location;
  goal: Goal;
  preferred_diet: PreferredDiet;
  dietary_restrictions: string[];
  caloric_limit: number | null;
}

/**
 * Request model for adding a snack to favorites
 */
export interface AddFavoriteRequest {
  snack_id: number;
}

// ----------------------
// Response DTOs
// ----------------------

/**
 * Metadata for paginated responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Response model for snack details
 * Ensures nullable fields from database are always strings in the API response
 */
export interface SnackDetailsResponse {
  id: number;
  title: string;
  description: string; // Non-nullable in response
  ingredients: string; // Non-nullable in response
  instructions: string; // Non-nullable in response
  snack_type: string;
  location: string;
  goal: string;
  preferred_diet: string;
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
  created_at: string;
}

/**
 * Response model for snack list items (simplified snack data)
 */
export interface SnackListItemResponse {
  id: number;
  title: string;
  description: string; // Non-nullable in response
  kcal: number;
  created_at: string;
}

/**
 * Response model for paginated snack lists
 */
export type SnackListResponse = PaginatedResponse<SnackListItemResponse>;

/**
 * Response model for favorite list items
 */
export interface FavoriteListItemResponse {
  id: number; // Generated composite id for the favorite
  snack_id: number;
  title: string;
  description: string;
  kcal: number;
  added_at: string;
}

/**
 * Response model for paginated favorite lists
 */
export type FavoriteListResponse = PaginatedResponse<FavoriteListItemResponse>;

/**
 * Response model for favorite details including full snack data
 */
export interface FavoriteDetailsResponse {
  id: number; // Generated composite id for the favorite
  snack_id: number;
  user_id: string;
  added_at: string;
  snack: SnackDetailsResponse;
}

/**
 * Response model after adding a snack to favorites
 */
export interface AddFavoriteResponse {
  id: number; // Generated composite id for the favorite
  user_id: string;
  snack_id: number;
  added_at: string;
}

/**
 * Response model after removing a snack from favorites
 */
export interface RemoveFavoriteResponse {
  success: boolean;
}

// ----------------------
// OpenRouter Service Types
// ----------------------

/**
 * Represents a message in a conversation
 */
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Represents a system message
 */
export interface SystemMessage extends Message {
  role: "system";
}

/**
 * Represents a user message
 */
export interface UserMessage extends Message {
  role: "user";
}

/**
 * Represents an assistant message
 */
export interface AssistantMessage extends Message {
  role: "assistant";
}

/**
 * Parameters for configuring model behavior
 */
export interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

/**
 * Format specification for model responses
 */
export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

/**
 * Represents an AI model's metadata
 */
export interface Model {
  id: string;
  name: string;
  provider: string;
  tokenLimit: number;
  // Other model properties
}

/**
 * Response from a chat completion request
 */
export interface ChatResponse {
  content: string;
  model: string;
  parsedJson?: unknown;
  // Response metadata
}

/**
 * JSON Schema definition
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  [key: string]: unknown;
}

// ----------------------
// Favorites View Models
// ----------------------

/**
 * View model for the favorites page
 */
export interface FavoritesPageViewModel {
  favorites: FavoriteListItemResponse[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

/**
 * View model for the favorite details modal
 */
export interface ModalViewModel {
  isOpen: boolean;
  selectedFavoriteId: number | null;
  favoriteDetails: FavoriteDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * View model for the confirm dialog
 */
export interface ConfirmDialogViewModel {
  isOpen: boolean;
  favoriteToDelete: FavoriteListItemResponse | null;
  loading: boolean;
}

/**
 * State for pagination component
 */
export interface PaginationState {
  currentPage: number;
  loading: boolean;
}

/**
 * Data structure for nutrition information
 */
export interface NutritionData {
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
}

// ----------------------
// Component Props Types
// ----------------------

/**
 * Props for FavoriteCard component
 */
export interface FavoriteCardProps {
  favorite: FavoriteListItemResponse;
  onViewDetails: (id: number) => void;
  onRemove: (favorite: FavoriteListItemResponse) => void;
}

// ----------------------
// Custom Hook Return Types
// ----------------------

/**
 * Return type for useFavorites hook
 */
export interface UseFavoritesReturn {
  favorites: FavoriteListItemResponse[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  currentPage: number;
  loadPage: (page: number) => Promise<void>;
  removeFavorite: (favoriteId: number) => Promise<void>;
  refreshList: () => Promise<void>;
}

/**
 * Return type for useFavoriteDetails hook
 */
export interface UseFavoriteDetailsReturn {
  favoriteDetails: FavoriteDetailsResponse | null;
  loading: boolean;
  error: string | null;
  loadDetails: (favoriteId: number) => Promise<void>;
  clearDetails: () => void;
}

/**
 * Return type for useModal hook
 */
export interface UseModalReturn {
  isOpen: boolean;
  openModal: (favoriteId: number) => void;
  closeModal: () => void;
}
