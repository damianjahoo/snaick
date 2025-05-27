import type { APIRoute } from "astro";
import { passwordResetSchema } from "../../../../lib/validation/auth.schema";
import type { PasswordResetDTO } from "../../../../types";
import { createSupabaseServerInstance } from "../../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, params, cookies }) => {
  try {
    // Get token from URL params
    const token = params.token;

    if (!token) {
      return new Response(JSON.stringify({ message: "Token jest wymagany" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await request.json();

    // Add token to body for validation
    const bodyWithToken = { ...body, token };

    // Validate input using Zod schema
    const validationResult = passwordResetSchema.safeParse(bodyWithToken);

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

    const { newPassword }: PasswordResetDTO = validationResult.data;

    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Update user password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password reset confirmation error:", error);

      if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        return new Response(
          JSON.stringify({ message: "Token jest nieprawidłowy lub wygasł. Poproś o nowy link do resetu hasła." }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ message: "Błąd podczas zmiany hasła" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: "Hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Password reset confirmation endpoint error:", error);

    return new Response(JSON.stringify({ message: "Wewnętrzny błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
