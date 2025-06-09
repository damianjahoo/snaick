import type { APIRoute } from "astro";
import { loginSchema } from "../../../lib/validation/auth.schema";
import type { LoginDTO } from "../../../types";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          message: "Nieprawidłowe dane wejściowe",
          errors: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password }: LoginDTO = validationResult.data;

    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Handle different types of auth errors
      if (error.message.includes("Invalid login credentials")) {
        return new Response(JSON.stringify({ message: "Nieprawidłowy email lub hasło" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("Email not confirmed")) {
        return new Response(
          JSON.stringify({ message: "Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową." }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Generic error for other cases
      return new Response(JSON.stringify({ message: "Błąd podczas logowania. Spróbuj ponownie." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: "Logowanie zakończone sukcesem",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(JSON.stringify({ message: "Wewnętrzny błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
