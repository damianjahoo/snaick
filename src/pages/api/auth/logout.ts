import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ locals, redirect }) => {
  try {
    const supabase = locals.supabase;
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(JSON.stringify({ message: "Błąd podczas wylogowania" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Redirect to home page after successful logout
    return redirect("/");
  } catch {
    return new Response(JSON.stringify({ message: "Wewnętrzny błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
