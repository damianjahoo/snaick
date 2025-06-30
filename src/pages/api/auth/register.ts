import type { APIRoute } from "astro";
import { registerSchema } from "../../../lib/validation/auth.schema";
import type { RegisterDTO } from "../../../types";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validationResult = registerSchema.safeParse(body);

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

    const validatedData: RegisterDTO = validationResult.data;

    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Attempt to sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      // Handle different types of auth errors
      if (error.message.includes("User already registered")) {
        return new Response(JSON.stringify({ message: "Użytkownik z tym adresem email już istnieje" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("Password should be at least")) {
        return new Response(JSON.stringify({ message: "Hasło jest zbyt słabe" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generic error for other cases
      return new Response(JSON.stringify({ message: "Błąd podczas rejestracji. Spróbuj ponownie." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Success response with information about email confirmation
    return new Response(
      JSON.stringify({
        message: "Rejestracja zakończona sukcesem. Sprawdź swoją skrzynkę pocztową w celu potwierdzenia konta.",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        requiresEmailConfirmation: true,
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
