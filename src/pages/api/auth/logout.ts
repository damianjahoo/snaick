import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return new Response(JSON.stringify({ message: "Błąd podczas wylogowania" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Redirect to home page after successful logout
    return redirect("/");
  } catch (error) {
    console.error("Logout endpoint error:", error);

    return new Response(JSON.stringify({ message: "Wewnętrzny błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
