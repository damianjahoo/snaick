import type { APIRoute } from "astro";
import { z } from "zod";
import type { AddFavoriteResponse } from "../../../types";
import { FavoriteService } from "../../../lib/services/favorite.service";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { addFavoriteSchema } from "../../../lib/validation/favorite.schema";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
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

    // Verify Supabase can see the authenticated user
    const {
      data: { user: supabaseUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !supabaseUser) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let validatedData;
    try {
      validatedData = addFavoriteSchema.parse(requestBody);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: error instanceof z.ZodError ? error.errors : error,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call service to add favorite
    const favoriteService = new FavoriteService(supabase);
    const result: AddFavoriteResponse = await favoriteService.addFavorite({
      userId: locals.user.id,
      snackId: validatedData.snack_id,
    });

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message === "Snack not found") {
        return new Response(JSON.stringify({ error: "Snack not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message === "Snack is already in favorites") {
        return new Response(JSON.stringify({ error: "Snack is already in favorites" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
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
