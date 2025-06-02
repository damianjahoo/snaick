import { z } from "zod";

// Schema for adding a snack to favorites
export const addFavoriteSchema = z.object({
  snack_id: z.number().int().positive("Identyfikator przekąski musi być liczbą dodatnią"),
});

// Schema for pagination parameters
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, "Numer strony musi być większy niż 0").default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit musi być większy niż 0")
    .max(100, "Limit nie może przekraczać 100")
    .default(20),
});

// Schema for ID parameter in URL
export const favoriteIdSchema = z.object({
  id: z.coerce.number().int().positive("Identyfikator ulubionej przekąski musi być liczbą dodatnią"),
});

// Type exports for TypeScript
export type AddFavoriteSchemaType = z.infer<typeof addFavoriteSchema>;
export type PaginationSchemaType = z.infer<typeof paginationSchema>;
export type FavoriteIdSchemaType = z.infer<typeof favoriteIdSchema>;
