import type { APIRoute } from "astro";
import { z } from "zod";
import type { SnackListResponse } from "../../types";
import { SnackService } from "../../lib/services/snack.service";
import { createSupabaseServerInstance } from "../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  // Parse query parameters
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "20";

  // Validate query parameters using zod
  const querySchema = z.object({
    page: z.preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().positive().default(20)),
  });

  let queryParams;
  try {
    queryParams = querySchema.parse({ page: pageParam, limit: limitParam });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid query parameters", details: error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // For testing, use default user from supabase
  const userId = "default-user";

  // Create Supabase server instance with proper SSR support
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Call the service layer to get snacks
  const snackService = new SnackService(supabase);
  try {
    const result: SnackListResponse = await snackService.getSnacks({
      userId: userId,
      page: queryParams.page,
      limit: queryParams.limit,
    });
    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
