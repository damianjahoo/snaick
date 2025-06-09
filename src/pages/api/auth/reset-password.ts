import type { APIRoute } from "astro";
import { passwordResetRequestSchema } from "../../../lib/validation/auth.schema";
import type { PasswordResetRequestDTO } from "../../../types";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validationResult = passwordResetRequestSchema.safeParse(body);

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

    const { email }: PasswordResetRequestDTO = validationResult.data;

    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/reset-password/confirm`,
    });

    if (error) {
      return new Response(JSON.stringify({ message: "Błąd podczas wysyłania emaila z resetem hasła" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Success response (always return success for security reasons)
    return new Response(
      JSON.stringify({
        message: "Jeśli podany adres email istnieje w naszej bazie, wysłaliśmy na niego link do resetu hasła.",
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
