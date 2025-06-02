import type { APIRoute } from "astro";
import { z } from "zod";
import type { FavoriteDetailsResponse, RemoveFavoriteResponse } from "../../../types";
import { FavoriteService } from "../../../lib/services/favorite.service";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { favoriteIdSchema } from "../../../lib/validation/favorite.schema";

export const prerender = false;

export const GET: APIRoute = async ({ params, request, cookies, locals }) => {
  try {
    // Check authentication from middleware
    if (!locals.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Validate ID parameter
    let validatedParams;
    try {
      validatedParams = favoriteIdSchema.parse({ id: params.id });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid ID parameter",
          details: error instanceof z.ZodError ? error.errors : error,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call service to get favorite details
    const favoriteService = new FavoriteService(supabase);
    const result: FavoriteDetailsResponse = await favoriteService.getFavoriteById({
      userId: locals.user.id,
      favoriteId: validatedParams.id,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/favorites/[id] error:", error);

    // Handle specific business logic errors
    if (error instanceof Error && error.message === "Favorite not found") {
      return new Response(JSON.stringify({ error: "Favorite not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request, cookies, locals }) => {
  try {
    // Check authentication from middleware
    if (!locals.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Supabase server instance
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Validate ID parameter
    let validatedParams;
    try {
      validatedParams = favoriteIdSchema.parse({ id: params.id });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid ID parameter",
          details: error instanceof z.ZodError ? error.errors : error,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call service to remove favorite
    const favoriteService = new FavoriteService(supabase);
    const result: RemoveFavoriteResponse = await favoriteService.removeFavorite({
      userId: locals.user.id,
      favoriteId: validatedParams.id,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /api/favorites/[id] error:", error);

    // Handle specific business logic errors
    if (error instanceof Error && error.message === "Favorite not found") {
      return new Response(JSON.stringify({ error: "Favorite not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
