import type { APIRoute } from "astro";
import { generateSnackSchema } from "../../../lib/validation/snack.schema";
import { SnackService } from "../../../lib/services/snack.service";
import type { GenerateSnackRequest } from "../../../types";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // For testing purposes, we're not implementing real authentication
    // In production, we would check the session here
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) {
    //   return new Response(
    //     JSON.stringify({ error: "Unauthorized" }),
    //     { status: 401, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body " + error,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validationResult = generateSnackSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validationResult.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate snack recommendation
    const snackService = new SnackService(supabase);
    const snackRecommendation = await snackService.generateSnackRecommendation(
      validationResult.data as GenerateSnackRequest
    );

    // Return the recommendation
    return new Response(JSON.stringify(snackRecommendation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Determine if this is a known error type or unknown
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
