import type { APIRoute } from "astro";
import { SnackService } from "../../../lib/services/snack.service";
import type { GenerateSnackRequest } from "../../../types";
import { generateSnackSchema } from "../../../lib/validation/snack.schema";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { locals, request } = context;
  const supabase = locals.supabase;

  if (!supabase) {
    // This should not happen when deployed on Cloudflare
    return new Response(JSON.stringify({ message: "Supabase client not available" }), { status: 500 });
  }

  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    let body: GenerateSnackRequest;
    try {
      body = await request.json();
      generateSnackSchema.parse(body);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ message: "Invalid request body", errors: errorMessage }), { status: 400 });
    }

    const snackService = new SnackService(supabase);
    const snackRecommendation = await snackService.generateSnackRecommendation(body);

    return new Response(JSON.stringify(snackRecommendation), {
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ message: "Failed to generate snack", error: errorMessage }), { status: 500 });
  }
};
